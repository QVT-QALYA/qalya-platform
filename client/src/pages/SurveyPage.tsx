import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AXES, SCALE_FR, SCALE_EN } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

const TEAL = "#01696F";
const TEAL_DARK = "#0C4E54";

function QalyaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="QALYA">
      <rect width="40" height="40" rx="8" fill={TEAL_DARK} />
      <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C23.18 32 26.073 30.8 28.25 28.82L30 31L32 29L30.18 27.18C31.34 25.12 32 22.64 32 20C32 13.373 26.627 8 20 8ZM20 30C14.477 30 10 25.523 10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20C30 22.36 29.24 24.54 27.94 26.3L25.18 23.54C25.69 22.44 26 21.25 26 20C26 16.686 23.314 14 20 14C16.686 14 14 16.686 14 20C14 23.314 16.686 26 20 26C21.38 26 22.65 25.56 23.7 24.82L26.46 27.58C24.6 29.06 22.4 30 20 30Z" fill="white"/>
    </svg>
  );
}

export default function SurveyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentAxe, setCurrentAxe] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ["/api/survey", slug],
    queryFn: () => apiRequest("GET", `/api/survey/${slug}`).then(r => r.json()),
  });

  useEffect(() => {
    if (campaign?.language) setLang(campaign.language === "en" ? "en" : "fr");
  }, [campaign]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const items: number[] = [];
      AXES.forEach(axe => {
        axe.items.forEach((_, i) => {
          items.push(answers[`${axe.id}_${i}`] || 3);
        });
      });
      return apiRequest("POST", `/api/survey/${slug}/respond`, {
        items,
        openAnswers,
      }).then(r => r.json());
    },
    onSuccess: () => {
      setLocation(`/survey/${slug}/done`);
    },
    onError: () => {
      toast({ title: lang === "fr" ? "Erreur lors de l'envoi" : "Submission error", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="flex flex-col items-center gap-4">
          <QalyaLogo size={48} />
          <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: TEAL, borderTopColor: "transparent" }} />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="text-center p-8">
          <QalyaLogo size={48} />
          <p className="mt-4 text-gray-500">Évaluation introuvable ou lien invalide.</p>
        </div>
      </div>
    );
  }

  if (campaign.status === "closed") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="text-center p-8">
          <QalyaLogo size={48} />
          <h2 className="mt-4 text-xl font-semibold">Évaluation clôturée</h2>
          <p className="mt-2 text-gray-500">Cette évaluation n'accepte plus de nouvelles réponses.</p>
        </div>
      </div>
    );
  }

  const axe = AXES[currentAxe];
  const scale = lang === "fr" ? SCALE_FR : SCALE_EN;
  const isLastAxe = currentAxe === AXES.length - 1;
  const progress = Math.round(((currentAxe) / AXES.length) * 100);

  const axeAnswered = axe.items.every((_, i) => answers[`${axe.id}_${i}`] !== undefined);

  const handleAnswer = (itemIdx: number, value: number) => {
    setAnswers(prev => ({ ...prev, [`${axe.id}_${itemIdx}`]: value }));
  };

  const handleNext = () => {
    if (!axeAnswered) {
      toast({ title: lang === "fr" ? "Veuillez répondre à toutes les questions" : "Please answer all questions", variant: "destructive" });
      return;
    }
    if (isLastAxe) {
      submitMutation.mutate();
    } else {
      setCurrentAxe(c => c + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F6F2" }}>
      {/* Header */}
      <header style={{ background: TEAL_DARK }} className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <QalyaLogo size={32} />
          <div>
            <div className="text-white font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>QALYA</div>
            <div className="text-white/70 text-xs">{campaign.companyName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")} className="text-white/70 text-xs px-2 py-1 rounded border border-white/20 hover:border-white/50 transition">
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <div className="text-white/70 text-xs">{currentAxe + 1} / {AXES.length}</div>
        </div>
      </header>

      {/* Progress */}
      <div style={{ background: TEAL_DARK }} className="px-6 pb-3">
        <Progress value={progress} className="h-1.5 bg-white/20" style={{ "--progress-bg": "white" } as any} />
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Axe header */}
        <div className="mb-6">
          <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: TEAL }}>
            {lang === "fr" ? axe.dimension : axe.dimensionEn}
          </div>
          <h1 className="text-2xl font-bold" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>
            {lang === "fr" ? axe.title : axe.titleEn}
          </h1>
        </div>

        {/* Items */}
        <div className="space-y-6">
          {axe.items.map((item, i) => {
            const selected = answers[`${axe.id}_${i}`];
            return (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {lang === "fr" ? item.text : item.textEn}
                </p>
                {/* Likert scale */}
                <div className="flex gap-2 justify-between">
                  {scale.map(s => (
                    <button
                      key={s.value}
                      data-testid={`item-${axe.id}-${i}-${s.value}`}
                      onClick={() => handleAnswer(i, s.value)}
                      className="flex-1 flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-150"
                        style={{
                          borderColor: selected === s.value ? TEAL : "#D4D1CA",
                          background: selected === s.value ? TEAL : "white",
                          color: selected === s.value ? "white" : "#7A7974",
                          transform: selected === s.value ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        {s.value}
                      </div>
                      <span className="text-xs text-center leading-tight" style={{ color: selected === s.value ? TEAL : "#BAB9B4" }}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Open question */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-medium mb-3" style={{ color: TEAL_DARK }}>
              {lang === "fr" ? axe.openQuestion : axe.openQuestionEn}
            </p>
            <Textarea
              data-testid={`open-${axe.id}`}
              placeholder={lang === "fr" ? "Réponse libre (optionnel)..." : "Optional free response..."}
              value={openAnswers[`axe${axe.id}`] || ""}
              onChange={e => setOpenAnswers(prev => ({ ...prev, [`axe${axe.id}`]: e.target.value }))}
              className="min-h-[80px] text-sm resize-none border-gray-200 focus:border-teal-600"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => { setCurrentAxe(c => c - 1); window.scrollTo(0, 0); }}
            disabled={currentAxe === 0}
            className="gap-2"
            data-testid="btn-prev"
          >
            <ChevronLeft size={16} />
            {lang === "fr" ? "Précédent" : "Previous"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={submitMutation.isPending}
            className="gap-2 px-6 text-white"
            style={{ background: axeAnswered ? TEAL : "#BAB9B4", border: "none" }}
            data-testid="btn-next"
          >
            {submitMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLastAxe ? (
              <><CheckCircle size={16} /> {lang === "fr" ? "Soumettre" : "Submit"}</>
            ) : (
              <>{lang === "fr" ? "Suivant" : "Next"} <ChevronRight size={16} /></>
            )}
          </Button>
        </div>

        {/* Anonymity notice */}
        <p className="text-center text-xs mt-6" style={{ color: "#BAB9B4" }}>
          {lang === "fr"
            ? "Vos réponses sont strictement anonymes — aucune donnée individuelle n'est collectée."
            : "Your responses are strictly anonymous — no individual data is collected."}
        </p>
      </main>
    </div>
  );
}

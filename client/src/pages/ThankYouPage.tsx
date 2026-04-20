import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";

const TEAL = "#01696F";
const TEAL_DARK = "#0C4E54";

export default function ThankYouPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: campaign } = useQuery({
    queryKey: ["/api/survey", slug, "done"],
    queryFn: () => apiRequest("GET", `/api/survey/${slug}`).then(r => r.json()),
    staleTime: 0,
  });

  const lang = campaign?.language === "en" ? "en" : "fr";
  const participation = campaign?.participationRate || 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F7F6F2" }}>
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#E6F2F3" }}>
          <CheckCircle size={32} style={{ color: TEAL }} />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>
          {lang === "fr" ? "Merci pour votre réponse" : "Thank you for your response"}
        </h1>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {lang === "fr"
            ? "Votre contribution est anonyme et sera intégrée au diagnostic organisationnel de votre entreprise."
            : "Your contribution is anonymous and will be included in your organization's diagnostic."}
        </p>

        {/* Participation bar */}
        {campaign && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{lang === "fr" ? "Taux de participation actuel" : "Current participation rate"}</span>
              <span className="font-semibold" style={{ color: TEAL }}>{participation}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(participation, 100)}%`, background: TEAL }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {lang === "fr"
                ? `Objectif : 70% minimum (${campaign.responseCount} / ${campaign.headcount} répondants)`
                : `Target: 70% minimum (${campaign.responseCount} / ${campaign.headcount} respondents)`}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-400 p-3 rounded-lg" style={{ background: "#F7F6F2" }}>
          {lang === "fr"
            ? "Le rapport sera communiqué à la direction par QALYA une fois le seuil de participation atteint."
            : "The report will be communicated to management by QALYA once the participation threshold is reached."}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-xs font-medium" style={{ color: TEAL }}>QALYA</div>
          <div className="text-xs text-gray-400">Référentiel indépendant de maturité organisationnelle</div>
        </div>
      </div>
    </div>
  );
}

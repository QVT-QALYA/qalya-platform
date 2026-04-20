import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link, BarChart3, RefreshCw, Users, Building } from "lucide-react";

const TEAL = "#01696F";
const TEAL_DARK = "#0C4E54";
const TEAL_LIGHT = "#E6F2F3";
const SECRET = "qalya-admin-2026";

interface CampaignWithStats {
  id: number;
  slug: string;
  companyName: string;
  contactEmail: string;
  language: string;
  headcount: number;
  plan: string;
  status: string;
  createdAt: string;
  responseCount: number;
  report?: { level: number; globalScore: number; participationRate: number };
}

function StatusBadge({ status, rate }: { status: string; rate: number }) {
  if (status === "reported") return <Badge className="text-xs" style={{ background: TEAL, color: "white" }}>Rapport généré</Badge>;
  if (rate >= 80) return <Badge className="text-xs" style={{ background: "#437A22", color: "white" }}>Prêt ({rate}%)</Badge>;
  return <Badge variant="secondary" className="text-xs">{rate}% répondu</Badge>;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactEmail: "", headcount: "50", plan: "eval", language: "fr" });

  const { data: campaigns, isLoading, refetch } = useQuery<CampaignWithStats[]>({
    queryKey: ["/api/admin/campaigns"],
    queryFn: () => apiRequest("GET", `/api/admin/campaigns?secret=${SECRET}`).then(r => r.json()),
    enabled: authed,
  });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/campaigns", { secret: SECRET, ...form, headcount: +form.headcount }).then(r => r.json()),
    onSuccess: (data) => {
      toast({ title: `Lien créé : /survey/${data.campaign.slug}` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      setShowCreate(false);
      setForm({ companyName: "", contactEmail: "", headcount: "50", plan: "eval", language: "fr" });
    },
    onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
  });

  const reportMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/campaigns/${id}/report`, { secret: SECRET }).then(r => r.json()),
    onSuccess: () => {
      toast({ title: "Rapport généré avec succès" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
    },
    onError: () => toast({ title: "Erreur lors de la génération du rapport", variant: "destructive" }),
  });

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/survey/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Lien copié !" });
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="bg-white rounded-2xl shadow-lg p-8 w-80">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold mb-1" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>QALYA</div>
            <div className="text-sm text-gray-500">Espace Administration</div>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Code d'accès administrateur"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && secretInput === SECRET && setAuthed(true)}
              data-testid="input-secret"
            />
            <Button
              className="w-full text-white"
              style={{ background: TEAL }}
              onClick={() => {
                if (secretInput === SECRET) setAuthed(true);
                else toast({ title: "Code incorrect", variant: "destructive" });
              }}
              data-testid="btn-login"
            >
              Accéder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalResponses = campaigns?.reduce((s, c) => s + c.responseCount, 0) || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;

  return (
    <div className="min-h-screen" style={{ background: "#F7F6F2" }}>
      <header style={{ background: TEAL_DARK }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>QALYA Admin</div>
            <div className="text-white/60 text-xs">Gestion des évaluations</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-1 border-white/20 text-white hover:bg-white/10">
              <RefreshCw size={14} /> Actualiser
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1 text-white" style={{ background: TEAL }}>
              <Plus size={14} /> Nouvelle évaluation
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Building, label: "Évaluations actives", value: activeCampaigns },
            { icon: Users, label: "Réponses totales", value: totalResponses },
            { icon: BarChart3, label: "Rapports générés", value: campaigns?.filter(c => c.report).length || 0 },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: TEAL_LIGHT }}>
                <stat.icon size={18} style={{ color: TEAL }} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2" style={{ borderColor: TEAL_LIGHT }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: TEAL_DARK }}>Nouvelle évaluation</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Nom de l'entreprise *</Label>
                <Input data-testid="input-company" placeholder="Ex: Acme SAS" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email de contact *</Label>
                <Input data-testid="input-email" type="email" placeholder="drh@acme.fr" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Effectif</Label>
                <Input data-testid="input-headcount" type="number" min={1} value={form.headcount} onChange={e => setForm(f => ({ ...f, headcount: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Formule</Label>
                <Select value={form.plan} onValueChange={v => setForm(f => ({ ...f, plan: v }))}>
                  <SelectTrigger data-testid="select-plan"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eval">Évaluation seule</SelectItem>
                    <SelectItem value="eval_report">Évaluation + Rapport stratégique</SelectItem>
                    <SelectItem value="level3">Programme Niveau 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Langue</Label>
                <Select value={form.language} onValueChange={v => setForm(f => ({ ...f, language: v }))}>
                  <SelectTrigger data-testid="select-lang"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="text-white gap-1" style={{ background: TEAL }} onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.companyName || !form.contactEmail} data-testid="btn-create">
                {createMutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                Créer le lien
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            </div>
          </div>
        )}

        {/* Campaigns list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold" style={{ color: TEAL_DARK }}>Évaluations en cours</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
          ) : !campaigns?.length ? (
            <div className="p-8 text-center text-gray-400 text-sm">Aucune évaluation — créez la première ci-dessus.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {campaigns.map(c => {
                const rate = Math.round((c.responseCount / c.headcount) * 100);
                return (
                  <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{c.companyName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.contactEmail} · {c.headcount} salariés · {c.language.toUpperCase()}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusBadge status={c.status} rate={rate} />
                        <span className="text-xs text-gray-400">{c.responseCount}/{c.headcount} réponses</span>
                      </div>
                      {c.report && (
                        <div className="text-xs mt-1" style={{ color: TEAL }}>
                          Niveau {c.report.level} — {c.report.globalScore}/100
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => copyLink(c.slug)} className="gap-1 text-xs h-8">
                        <Link size={12} /> Copier lien
                      </Button>
                      {!c.report && (
                        <Button
                          size="sm"
                          className="gap-1 text-white text-xs h-8"
                          style={{ background: rate >= 70 ? TEAL : "#BAB9B4", border: "none" }}
                          onClick={() => reportMutation.mutate(c.id)}
                          disabled={reportMutation.isPending}
                          data-testid={`btn-report-${c.id}`}
                        >
                          <BarChart3 size={12} />
                          {rate >= 70 ? "Générer rapport" : `Attendre (${rate}%)`}
                        </Button>
                      )}
                      {c.report && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={() => window.open(`#/survey/${c.slug}/report`, "_blank")}
                        >
                          <BarChart3 size={12} /> Voir rapport
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-xs text-center text-gray-400">
          QALYA Administration — Confidentiel · {new Date().getFullYear()}
        </div>
      </main>
    </div>
  );
}

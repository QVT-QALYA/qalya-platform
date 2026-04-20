import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DIMENSIONS } from "@/data/questions";

const TEAL = "#01696F";
const TEAL_DARK = "#0C4E54";
const TEAL_LIGHT = "#E6F2F3";

function RadarChart({ scores }: { scores: number[] }) {
  const cx = 150, cy = 150, r = 100;
  const n = scores.length;
  const labels = DIMENSIONS.map(d => d.name);

  const getPoint = (idx: number, radius: number) => {
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];
  const scorePoints = scores.map((s, i) => getPoint(i, (s / 100) * r));
  const scoreStr = scorePoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {/* Grid circles */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, i) => {
            const pt = getPoint(i, (level / 100) * r);
            return `${pt.x},${pt.y}`;
          }).join(" ")}
          fill="none"
          stroke="#D4D1CA"
          strokeWidth="0.5"
        />
      ))}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const pt = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#D4D1CA" strokeWidth="0.5" />;
      })}
      {/* Score area */}
      <polygon points={scoreStr} fill={TEAL} fillOpacity="0.2" stroke={TEAL} strokeWidth="2" />
      {/* Score dots */}
      {scorePoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="4" fill={TEAL} stroke="white" strokeWidth="2" />
      ))}
      {/* Labels */}
      {Array.from({ length: n }, (_, i) => {
        const pt = getPoint(i, r + 24);
        return (
          <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="#28251D" fontFamily="Inter, sans-serif">
            {labels[i].split(" ").map((word, wi) => (
              <tspan key={wi} x={pt.x} dy={wi === 0 ? 0 : 11}>{word}</tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#01696F" : score >= 70 ? "#437A22" : score >= 55 ? "#D19900" : score >= 40 ? "#964219" : "#A12C7B";
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: color }}>
      {score}/100
    </span>
  );
}

function LevelBadge({ level }: { level: number }) {
  const configs = {
    1: { label: "Organisation en déséquilibre", color: "#A84B2F", bg: "#FEF2EE" },
    2: { label: "Organisation structurée", color: "#D19900", bg: "#FFF9E6" },
    3: { label: "Organisation mature", color: TEAL_DARK, bg: TEAL_LIGHT },
  };
  const c = configs[level as 1 | 2 | 3];
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: c.bg, color: c.color }}>
      <span className="text-lg">{"★".repeat(level)}{"☆".repeat(3 - level)}</span>
      Niveau {level} — {c.label}
    </div>
  );
}

export default function ReportPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["/api/survey", slug, "report"],
    queryFn: () => apiRequest("GET", `/api/survey/${slug}/report`).then(r => r.json()),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: TEAL }} />
      </div>
    );
  }

  if (error || !report || report.error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F2" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Rapport non disponible</h2>
          <p className="text-gray-500 text-sm">Le rapport sera généré une fois le seuil de participation atteint.</p>
        </div>
      </div>
    );
  }

  // Support both old (camelCase) and new (snake_case / JSONB) formats
  const ds = report.dimension_scores || {};
  const dimScores = [
    report.dim1Score ?? ds.dim1 ?? 0,
    report.dim2Score ?? ds.dim2 ?? 0,
    report.dim3Score ?? ds.dim3 ?? 0,
    report.dim4Score ?? ds.dim4 ?? 0,
    report.dim5Score ?? ds.dim5 ?? 0,
    report.dim6Score ?? ds.dim6 ?? 0,
  ];
  const globalScore = report.globalScore ?? report.global_score ?? 0;
  const participationRate = report.participationRate ?? report.participation_rate ?? 0;
  const generatedAt = report.generatedAt ?? report.generated_at;
  const recs: string[] = typeof report.recommendations === "string"
    ? JSON.parse(report.recommendations)
    : (report.recommendations || []);

  return (
    <div className="min-h-screen" style={{ background: "#F7F6F2" }}>
      {/* Header */}
      <header style={{ background: TEAL_DARK }} className="px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-white/60 text-xs mb-1 uppercase tracking-wider">Rapport QALYA</div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {report.companyName}
          </h1>
          <div className="text-white/60 text-sm mt-1">
            Généré le {new Date(generatedAt).toLocaleDateString("fr-FR")} · {participationRate}% de participation
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Level */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm text-gray-500 mb-3">Niveau attribué</div>
          <LevelBadge level={report.level} />
          <div className="mt-4 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>
                {globalScore}
              </div>
              <div className="text-xs text-gray-400">Score global /100</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: TEAL_DARK, fontFamily: "'DM Sans', sans-serif" }}>
                {participationRate}%
              </div>
              <div className="text-xs text-gray-400">Participation</div>
            </div>
          </div>
          {report.level === 3 && (
            <div className="mt-4 p-3 rounded-xl text-sm font-medium" style={{ background: TEAL_LIGHT, color: TEAL_DARK }}>
              Attestation officielle QALYA Niveau 3 — valide 12 mois
            </div>
          )}
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4" style={{ color: TEAL_DARK }}>Radar des 6 dimensions</h2>
          <RadarChart scores={dimScores} />
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4" style={{ color: TEAL_DARK }}>Scores par dimension</h2>
          <div className="space-y-3">
            {DIMENSIONS.map((dim, i) => (
              <div key={dim.id} className="flex items-center gap-3">
                <div className="text-sm text-gray-700 flex-1 min-w-0 truncate">{dim.name}</div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${dimScores[i]}%`,
                        background: dimScores[i] >= 70 ? TEAL : dimScores[i] >= 50 ? "#D19900" : "#A84B2F",
                      }}
                    />
                  </div>
                  <ScoreBadge score={Math.round(dimScores[i])} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
            Seuil requis pour le Niveau 3 : 70/100 sur chaque dimension
          </div>
        </div>

        {/* Recommendations */}
        {recs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4" style={{ color: TEAL_DARK }}>Axes prioritaires d'amélioration</h2>
            <div className="space-y-3">
              {recs.map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "#FEF9EE" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "#D19900", color: "white" }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <div className="text-xs font-medium" style={{ color: TEAL }}>QALYA</div>
          <div className="text-xs text-gray-400">Référentiel propriétaire — Résultats confidentiels</div>
        </div>
      </main>
    </div>
  );
}

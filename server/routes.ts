import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";

// ── Scoring helpers ──────────────────────────────────────────────────────────
// Axe → Dimension mapping
const AXE_TO_DIM: Record<number, number> = {
  1: 1, 6: 1,          // Alignement stratégique
  2: 2, 4: 2,          // Cohérence managériale
  3: 3,                // Architecture organisationnelle
  8: 4, 10: 4,         // Dynamique collective
  7: 5, 11: 5,         // Soutenabilité de la performance
  5: 6, 9: 6,          // Maturité sociale
};

function computeScores(rawItems: number[]) {
  // rawItems: 44 values, indices 0-43, grouped by axe (4 per axe)
  const axeScores: number[] = [];
  for (let a = 0; a < 11; a++) {
    const slice = rawItems.slice(a * 4, a * 4 + 4);
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    axeScores.push(avg);
  }

  // Dimension scores (average of axes in that dimension)
  const dimGroups: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  axeScores.forEach((score, i) => {
    const dim = AXE_TO_DIM[i + 1];
    if (dim) dimGroups[dim].push(score);
  });

  const dimScores = Object.keys(dimGroups).map((d) => {
    const arr = dimGroups[+d];
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  });

  // Convert 1-5 scale to 0-100
  const toHundred = (v: number) => Math.round(((v - 1) / 4) * 100);
  const dimHundred = dimScores.map(toHundred);
  const global = Math.round(dimHundred.reduce((s, v) => s + v, 0) / dimHundred.length);

  // Level determination
  const allAbove70 = dimHundred.every((d) => d >= 70);
  const level = global >= 70 && allAbove70 ? 3 : global >= 45 ? 2 : 1;

  return { axeScores, dimScores: dimHundred, global, level };
}

function generateRecommendations(dimScores: number[], _language: string) {
  const dims = [
    { dim: "Alignement stratégique", low: "Clarifier la vision et renforcer la communication des orientations stratégiques à tous les niveaux." },
    { dim: "Cohérence managériale", low: "Harmoniser les pratiques managériales et renforcer la formation des encadrants intermédiaires." },
    { dim: "Architecture organisationnelle", low: "Revoir la répartition des rôles et formaliser les processus clés pour réduire les zones de flou." },
    { dim: "Dynamique collective", low: "Investir dans la cohésion d'équipe et créer des espaces de coopération transversale structurés." },
    { dim: "Soutenabilité de la performance", low: "Mettre en place des mécanismes de régulation de la charge et renforcer la capacité d'adaptation." },
    { dim: "Maturité sociale", low: "Revoir la politique de reconnaissance et renforcer les dispositifs de développement des compétences." },
  ];
  return dimScores
    .map((score, i) => ({ score, rec: dims[i] }))
    .filter((r) => r.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((r) => `${r.rec.dim} (${r.score}/100) : ${r.rec.low}`);
}

// ── Admin secret ─────────────────────────────────────────────────────────────
const ADMIN_SECRET = "qalya-admin-2026";

export function registerRoutes(_httpServer: Server, app: Express) {

  // ── Admin: create campaign ────────────────────────────────────────────────
  app.post("/api/admin/campaigns", async (req, res) => {
    try {
      const { secret, companyName, contactEmail, headcount, plan, language } = req.body;
      if (secret !== ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });
      if (!companyName || !contactEmail || !headcount) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const slug = nanoid(10);
      const campaign = await storage.createCampaign({
        slug,
        company_name: companyName,
        contact_email: contactEmail,
        headcount: +headcount,
        plan: plan || "eval",
        language: language || "fr",
        status: "active",
      });
      res.json({ campaign, link: `/survey/${slug}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Admin: list campaigns ─────────────────────────────────────────────────
  app.get("/api/admin/campaigns", async (req, res) => {
    try {
      const { secret } = req.query;
      if (secret !== ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });

      const campaigns = await storage.listCampaigns();
      const all = await Promise.all(
        campaigns.map(async (c) => {
          const responseCount = await storage.getResponseCount(c.id);
          const report = await storage.getReport(c.id);
          const normalized = {
            ...c,
            companyName: c.company_name,
            contactEmail: c.contact_email,
            createdAt: c.created_at,
            responseCount,
            report: report ? {
              level: report.level,
              globalScore: report.global_score,
              participationRate: report.participation_rate,
            } : null,
          };
          return normalized;
        })
      );
      res.json(all);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Admin: generate report ────────────────────────────────────────────────
  app.post("/api/admin/campaigns/:id/report", async (req, res) => {
    try {
      const { secret } = req.body;
      if (secret !== ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });

      const campaigns = await storage.listCampaigns();
      const campaign = campaigns.find((c) => c.id === +req.params.id);
      if (!campaign) return res.status(404).json({ error: "Not found" });

      const allResponses = await storage.getResponses(campaign.id);
      if (allResponses.length === 0) return res.status(400).json({ error: "No responses" });

      // Aggregate raw items
      const aggregated = Array(44).fill(0);
      allResponses.forEach((r) => {
        const items: number[] = r.items;
        items.forEach((v, i) => { aggregated[i] += v; });
      });
      const avg = aggregated.map((v) => v / allResponses.length);

      const { dimScores, global, level } = computeScores(avg);
      const participationRate = Math.round((allResponses.length / campaign.headcount) * 100);
      const recs = generateRecommendations(dimScores, campaign.language);

      const dimensionScores = {
        dim1: dimScores[0],
        dim2: dimScores[1],
        dim3: dimScores[2],
        dim4: dimScores[3],
        dim5: dimScores[4],
        dim6: dimScores[5],
      };

      const report = await storage.saveReport({
        campaign_id: campaign.id,
        level,
        global_score: global,
        dimension_scores: dimensionScores,
        recommendations: recs,
        participation_rate: participationRate,
      });

      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Public: get campaign info ─────────────────────────────────────────────
  app.get("/api/survey/:slug", async (req, res) => {
    try {
      const campaign = await storage.getCampaignBySlug(req.params.slug);
      if (!campaign) return res.status(404).json({ error: "Not found" });
      const count = await storage.getResponseCount(campaign.id);
      const participationRate = Math.round((count / campaign.headcount) * 100);
      res.json({
        companyName: campaign.company_name,
        language: campaign.language,
        status: campaign.status,
        participationRate,
        responseCount: count,
        headcount: campaign.headcount,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Public: submit response ───────────────────────────────────────────────
  app.post("/api/survey/:slug/respond", async (req, res) => {
    try {
      const campaign = await storage.getCampaignBySlug(req.params.slug);
      if (!campaign) return res.status(404).json({ error: "Not found" });
      if (campaign.status === "closed") return res.status(403).json({ error: "Closed" });

      const { items, openAnswers } = req.body;
      if (!items || !Array.isArray(items) || items.length !== 44) {
        return res.status(400).json({ error: "Invalid items" });
      }

      await storage.addResponse(campaign.id, items, openAnswers || {});

      const count = await storage.getResponseCount(campaign.id);
      const participationRate = Math.round((count / campaign.headcount) * 100);
      res.json({ success: true, participationRate });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Public: get report ────────────────────────────────────────────────────
  app.get("/api/survey/:slug/report", async (req, res) => {
    try {
      const campaign = await storage.getCampaignBySlug(req.params.slug);
      if (!campaign) return res.status(404).json({ error: "Not found" });
      const report = await storage.getReport(campaign.id);
      if (!report) return res.status(404).json({ error: "No report yet" });
      res.json({ ...report, companyName: campaign.company_name });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

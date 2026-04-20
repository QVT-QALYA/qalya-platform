import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Campaigns (one per client company) ──────────────────────────────────────
export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),          // unique URL token
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  language: text("language").notNull().default("fr"), // "fr" | "en"
  headcount: integer("headcount").notNull(),      // for pricing tier
  plan: text("plan").notNull().default("eval"),   // "eval" | "eval_report" | "level3"
  status: text("status").notNull().default("active"), // "active" | "closed" | "reported"
  createdAt: text("created_at").notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

// ── Responses (one per employee) ────────────────────────────────────────────
export const responses = sqliteTable("responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaignId: integer("campaign_id").notNull(),
  // Scores per axe (1–5 scale, average of 4 items)
  axe1: real("axe1"),
  axe2: real("axe2"),
  axe3: real("axe3"),
  axe4: real("axe4"),
  axe5: real("axe5"),
  axe6: real("axe6"),
  axe7: real("axe7"),
  axe8: real("axe8"),
  axe9: real("axe9"),
  axe10: real("axe10"),
  axe11: real("axe11"),
  // Raw items (JSON stringified array of 44 integers)
  rawItems: text("raw_items").notNull(),
  // Open answers (JSON stringified object)
  openAnswers: text("open_answers").notNull().default("{}"),
  submittedAt: text("submitted_at").notNull(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({ id: true });
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

// ── Reports ──────────────────────────────────────────────────────────────────
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaignId: integer("campaign_id").notNull(),
  level: integer("level").notNull(),           // 1 | 2 | 3
  globalScore: real("global_score").notNull(),
  dim1Score: real("dim1_score").notNull(),     // Alignement stratégique
  dim2Score: real("dim2_score").notNull(),     // Cohérence managériale
  dim3Score: real("dim3_score").notNull(),     // Architecture organisationnelle
  dim4Score: real("dim4_score").notNull(),     // Dynamique collective
  dim5Score: real("dim5_score").notNull(),     // Soutenabilité de la performance
  dim6Score: real("dim6_score").notNull(),     // Maturité sociale
  participationRate: real("participation_rate").notNull(),
  recommendations: text("recommendations").notNull().default("[]"),
  generatedAt: text("generated_at").notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({ id: true });
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

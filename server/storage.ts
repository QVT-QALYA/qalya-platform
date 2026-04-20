import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zlelekafohkvkhheqgqb.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZWxla2Fmb2hrdmtoaGVxZ3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjYxNDAsImV4cCI6MjA5MjIwMjE0MH0.8wRNuSYS_awJMTi0J4t-TSDgCQ9erYw5aXjdEVRWri4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface Campaign {
  id: number;
  slug: string;
  company_name: string;
  contact_email: string;
  language: string;
  headcount: number;
  plan: string;
  status: string;
  created_at: string;
}

export interface Report {
  id: number;
  campaign_id: number;
  level: number;
  global_score: number;
  dimension_scores: Record<string, number>;
  recommendations: string[];
  participation_rate: number;
  generated_at: string;
}

export const storage = {
  // ---- CAMPAIGNS ----
  async createCampaign(data: Omit<Campaign, "id" | "created_at">): Promise<Campaign> {
    const { data: row, error } = await supabase
      .from("campaigns")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  },

  async getCampaignBySlug(slug: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return data;
  },

  async listCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data;
  },

  // ---- RESPONSES ----
  async addResponse(campaignId: number, items: number[], openAnswers: Record<string, string>): Promise<void> {
    const { error } = await supabase.from("responses").insert({
      campaign_id: campaignId,
      items,
      open_answers: openAnswers,
    });
    if (error) throw new Error(error.message);
  },

  async getResponseCount(campaignId: number): Promise<number> {
    const { count, error } = await supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("campaign_id", campaignId);
    if (error) return 0;
    return count || 0;
  },

  async getResponses(campaignId: number): Promise<{ items: number[]; open_answers: Record<string, string> }[]> {
    const { data, error } = await supabase
      .from("responses")
      .select("items, open_answers")
      .eq("campaign_id", campaignId);
    if (error) return [];
    return data;
  },

  // ---- REPORTS ----
  async saveReport(report: Omit<Report, "id" | "generated_at">): Promise<Report> {
    // Upsert on campaign_id
    const { data, error } = await supabase
      .from("reports")
      .upsert(report, { onConflict: "campaign_id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getReport(campaignId: number): Promise<Report | null> {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("campaign_id", campaignId)
      .single();
    if (error) return null;
    return data;
  },

  async getTotalReportCount(): Promise<number> {
    const { count } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });
    return count || 0;
  },
};

import type { ApiArticle, Article } from "./types";
import { sourceForRow } from "./sources";

// n8n webhooks. VITE_NEWS_API lets a local build point somewhere else.
const API = import.meta.env.VITE_NEWS_API ?? "https://jarllindquist.com/n8n/webhook";
const LATEST_URL = `${API}/news/latest`;
const FEED_URL = `${API}/043557d6-47e3-4f61-94f2-11ffcf2c8fa9/news/feed`;

const EMPTY_SUMMARIES = new Set(["", "ingen beskrivning.", "sammanfattning saknas"]);

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// The model writes either "- point\n- point" or plain prose.
function splitSummary(summary: string | undefined): { points: string[]; text: string } {
  const clean = (summary ?? "").trim();
  if (EMPTY_SUMMARIES.has(clean.toLowerCase())) return { points: [], text: "" };

  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const bullet = /^[-•*◆]\s+/;
  if (lines.length > 1 && lines.every((l) => bullet.test(l))) {
    return { points: lines.map((l) => l.replace(bullet, "")), text: "" };
  }
  return { points: [], text: lines.join(" ") };
}

// The long version is either "- point" lines or paragraphs separated by blank lines.
function splitLong(summary: string | null | undefined): { points: string[]; paragraphs: string[] } {
  const clean = (summary ?? "").trim();
  if (!clean) return { points: [], paragraphs: [] };
  const { points } = splitSummary(clean);
  if (points.length) return { points, paragraphs: [] };
  const paragraphs = clean.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  return { points: [], paragraphs };
}

function safeUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

export function normalise(row: ApiArticle): Article {
  const source = sourceForRow(row.source_key, row.sender || row.author);
  const { points, text } = splitSummary(row.summary);
  const long = splitLong(row.summary_long);
  return {
    longPoints: long.points,
    longParagraphs: long.paragraphs,
    id: row.id,
    title: (row.title ?? "").trim() || "Utan rubrik",
    source: source.key,
    sourceLabel: source.key === "other" ? (row.sender ?? "").split("<")[0].replace(/"/g, "").trim() || source.label : source.label,
    summaryPoints: points,
    summaryText: text,
    url: safeUrl(row.url),
    date: parseDate(row.sent_at) ?? parseDate(row.created_at),
  };
}

// The endpoints answer [] , [{ success: true }] (no rows) or a list of rows.
async function getRows(url: string, signal?: AbortSignal): Promise<ApiArticle[]> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Servern svarade ${res.status}`);
  const body = await res.text();
  if (!body.trim()) return [];
  const rows = JSON.parse(body);
  if (!Array.isArray(rows)) throw new Error("Oväntat svar från servern");
  return rows.filter((r) => r && typeof r.id === "number");
}

export interface Latest {
  articles: Article[]; // the newest mail of each source
  counts: Map<string, number>; // how many mails each source has
}

export async function fetchLatest(signal?: AbortSignal): Promise<Latest> {
  const rows = await getRows(LATEST_URL, signal);
  const counts = new Map<string, number>();
  const articles = rows.map((row) => {
    const a = normalise(row);
    counts.set(a.source, (counts.get(a.source) ?? 0) + (Number(row.source_total) || 0));
    return a;
  });
  return { articles, counts };
}

export interface FeedPage {
  articles: Article[];
  total: number; // all rows that match, not just this page
}

export async function fetchFeed(
  opts: { source: string; query: string; offset: number; limit: number },
  signal?: AbortSignal,
): Promise<FeedPage> {
  const source = encodeURIComponent(opts.source || "all");
  const q = opts.query.trim() ? `?q=${encodeURIComponent(opts.query.trim())}` : "";
  const rows = await getRows(`${FEED_URL}/${source}/${opts.limit}/${opts.offset}${q}`, signal);
  return { articles: rows.map(normalise), total: rows.length ? Number(rows[0].total) || rows.length : 0 };
}

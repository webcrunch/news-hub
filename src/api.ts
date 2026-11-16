import type { ApiArticle, Article } from "./types";
import { sourceForRow } from "./sources";

// The endpoint caps limit at 50. VITE_NEWS_URL lets a local build read a saved copy instead.
const NEWS_URL =
  import.meta.env.VITE_NEWS_URL ??
  "https://jarllindquist.com/n8n/webhook/043557d6-47e3-4f61-94f2-11ffcf2c8fa9/news/all/50/0";

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
  return {
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

export async function fetchArticles(signal?: AbortSignal): Promise<Article[]> {
  const res = await fetch(NEWS_URL, { signal });
  if (!res.ok) throw new Error(`Servern svarade ${res.status}`);
  const body = await res.text();
  if (!body.trim()) return [];
  const rows = JSON.parse(body);
  if (!Array.isArray(rows)) throw new Error("Oväntat svar från servern");
  return rows.map(normalise);
}

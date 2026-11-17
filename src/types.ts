// One row from the n8n endpoint GET /news/all/:limit/:offset
export interface ApiArticle {
  id: number;
  title?: string;
  author?: string;
  summary?: string;
  summary_long?: string | null; // the fuller version for the reading view (newer mails only)
  category?: string;
  sender?: string;
  url?: string;
  created_at?: string;
  sent_at?: string;
  displayDate?: string;
  source_key?: string; // key in newsletter_sources; the same keys as SOURCES in sources.ts
  total?: string | number; // /news/feed: rows matching the filter
  source_total?: string | number; // /news/latest: mails of this source
}

// What the page works with after normalising the API row
export interface Article {
  id: number;
  title: string;
  source: string; // key in SOURCES, or "other"
  sourceLabel: string;
  summaryPoints: string[]; // the summary as bullet points, if it is a list
  summaryText: string; // the summary as one paragraph, if it is not a list
  // The fuller version for the reading view; both empty when the mail has none
  longPoints: string[];
  longParagraphs: string[];
  url: string | null;
  date: Date | null;
}

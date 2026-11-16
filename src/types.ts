// One row from the n8n endpoint GET /news/all/:limit/:offset
export interface ApiArticle {
  id: number;
  title?: string;
  author?: string;
  summary?: string;
  category?: string;
  sender?: string;
  url?: string;
  created_at?: string;
  sent_at?: string;
  displayDate?: string;
}

// What the page works with after normalising the API row
export interface Article {
  id: number;
  title: string;
  source: string; // key in SOURCES, or "other"
  sourceLabel: string;
  summaryPoints: string[]; // the summary as bullet points, if it is a list
  summaryText: string; // the summary as one paragraph, if it is not a list
  url: string | null;
  date: Date | null;
}

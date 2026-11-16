// Every newsletter in one place: how a sender is recognised, its name and its colour.
// The colour is only used for the small dot beside the name; text keeps the normal ink colour.
export interface Source {
  key: string;
  label: string;
  match: RegExp; // tested against the raw sender, e.g. "TLDR DevOps <dan@tldrnewsletter.com>"
  hue: string; // CSS colour token, defined in index.css for light and dark
}

export const SOURCES: Source[] = [
  { key: "daily-dev", label: "daily.dev", match: /daily\.dev/i, hue: "var(--src-1)" },
  { key: "tldr", label: "TLDR", match: /tldrnewsletter\.com/i, hue: "var(--src-2)" },
  { key: "codeanywhere", label: "Codeanywhere", match: /codeanywhere/i, hue: "var(--src-3)" },
  { key: "bruno", label: "Bruno Souza", match: /bruno/i, hue: "var(--src-4)" },
  { key: "greg", label: "Greg Sidelnikov", match: /sidelnikov/i, hue: "var(--src-5)" },
  { key: "piotr", label: "Piotr's TechBlog", match: /piotr/i, hue: "var(--src-6)" },
  { key: "csharp", label: "C# Digest", match: /c#|csharp/i, hue: "var(--src-other)" },
];

const OTHER: Source = { key: "other", label: "Övrigt", match: /$^/, hue: "var(--src-other)" };

export function sourceFor(sender: string | undefined): Source {
  const raw = sender ?? "";
  return SOURCES.find((s) => s.match.test(raw)) ?? OTHER;
}

// The endpoint sends the source key from the database; the sender text is only a fallback.
export function sourceForRow(sourceKey: string | undefined, sender: string | undefined): Source {
  const byKey = sourceKey ? SOURCES.find((s) => s.key === sourceKey) : undefined;
  return byKey ?? sourceFor(sender);
}

export function sourceByKey(key: string): Source {
  return SOURCES.find((s) => s.key === key) ?? OTHER;
}

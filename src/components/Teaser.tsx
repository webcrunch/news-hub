import { Show } from "solid-js";
import type { Component } from "solid-js";
import type { Article } from "../types";
import { sourceByKey } from "../sources";
import { dateFormat } from "./format";

// One sentence that stands on its own: the first point, or the start of the text cut at a sentence end.
export function teaserText(a: Article, max = 190): string {
  const base = (a.summaryPoints[0] ?? a.summaryText ?? "").trim();
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (end > 80) return cut.slice(0, end + 1);
  return cut.replace(/\s+\S*$/, "") + "…";
}

// The overview card: the whole card opens the reading view.
const Teaser: Component<{ article: Article; onOpen: (a: Article) => void }> = (props) => {
  const a = () => props.article;
  return (
    <article class="card teaser">
      <header class="card-meta">
        <span class="source">
          <span class="dot" style={{ background: sourceByKey(a().source).hue }} aria-hidden="true" />
          {a().sourceLabel}
        </span>
        <Show when={a().date}>{(d) => <time datetime={d().toISOString()}>{dateFormat.format(d())}</time>}</Show>
      </header>
      <h3 class="card-title">
        <button type="button" class="stretch" onClick={() => props.onOpen(a())}>
          {a().title}
        </button>
      </h3>
      <Show when={teaserText(a())}>{(t) => <p class="summary">{t()}</p>}</Show>
      <footer class="teaser-more" aria-hidden="true">
        Läs mer <span>→</span>
      </footer>
    </article>
  );
};

export default Teaser;

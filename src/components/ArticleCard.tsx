import { For, Show } from "solid-js";
import type { Component } from "solid-js";
import type { Article } from "../types";
import { sourceByKey } from "../sources";
import { dateFormat } from "./format";

// Long prose (daily.dev's own summaries) is cut here; the rest is in the reading view
const MAX_CHARS = 320;

// A card in "Alla nyheter": the short summary in full, "Läs mer" opens the reading view.
const ArticleCard: Component<{ article: Article; onOpen: (a: Article) => void }> = (props) => {
  const a = () => props.article;
  const cut = () => a().summaryText.length > MAX_CHARS;
  const text = () => (cut() ? a().summaryText.slice(0, MAX_CHARS).replace(/\s+\S*$/, "") + "…" : a().summaryText);
  const more = () => cut() || a().longParagraphs.length > 0 || a().longPoints.length > 0;

  return (
    <article class="card">
      <header class="card-meta">
        <span class="source">
          <span class="dot" style={{ background: sourceByKey(a().source).hue }} aria-hidden="true" />
          {a().sourceLabel}
        </span>
        <Show when={a().date}>{(d) => <time datetime={d().toISOString()}>{dateFormat.format(d())}</time>}</Show>
      </header>

      <h3 class="card-title">{a().title}</h3>

      <Show
        when={a().summaryPoints.length || a().summaryText}
        fallback={<p class="summary empty">Ingen sammanfattning för det här utskicket.</p>}
      >
        <Show when={a().summaryPoints.length} fallback={<p class="summary">{text()}</p>}>
          <ul class="summary points">
            <For each={a().summaryPoints}>{(p) => <li>{p}</li>}</For>
          </ul>
        </Show>
      </Show>

      <Show when={more() || a().url}>
        <footer class="card-actions">
          <Show when={more()}>
            <button type="button" class="link-button" onClick={() => props.onOpen(a())}>
              Läs mer
            </button>
          </Show>
          <Show when={a().url}>
            {(url) => (
              <a class="read" href={url()} target="_blank" rel="noopener noreferrer">
                Läs artikel <span aria-hidden="true">→</span>
              </a>
            )}
          </Show>
        </footer>
      </Show>
    </article>
  );
};

export default ArticleCard;

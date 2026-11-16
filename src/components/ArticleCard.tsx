import { For, Show, createSignal } from "solid-js";
import type { Component } from "solid-js";
import type { Article } from "../types";
import { sourceByKey } from "../sources";

const dateFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" });

// Long summaries are folded after this many points or characters
const MAX_POINTS = 4;
const MAX_CHARS = 320;

const ArticleCard: Component<{ article: Article }> = (props) => {
  const [open, setOpen] = createSignal(false);
  const a = () => props.article;
  const long = () => a().summaryPoints.length > MAX_POINTS || a().summaryText.length > MAX_CHARS;
  const points = () => (open() ? a().summaryPoints : a().summaryPoints.slice(0, MAX_POINTS));
  const text = () =>
    open() || a().summaryText.length <= MAX_CHARS
      ? a().summaryText
      : a().summaryText.slice(0, MAX_CHARS).replace(/\s+\S*$/, "") + "…";

  return (
    <article class="card">
      <header class="card-meta">
        <span class="source">
          <span class="dot" style={{ background: sourceByKey(a().source).hue }} aria-hidden="true" />
          {a().sourceLabel}
        </span>
        <Show when={a().date}>
          {(d) => <time datetime={d().toISOString()}>{dateFormat.format(d())}</time>}
        </Show>
      </header>

      <h2 class="card-title">{a().title}</h2>

      <Show
        when={a().summaryPoints.length || a().summaryText}
        fallback={<p class="summary empty">Ingen sammanfattning för det här utskicket.</p>}
      >
        <Show when={a().summaryPoints.length} fallback={<p class="summary">{text()}</p>}>
          <ul class="summary points">
            <For each={points()}>{(p) => <li>{p}</li>}</For>
          </ul>
        </Show>
      </Show>

      <Show when={long() || a().url}>
        <footer class="card-actions">
          <Show when={long()}>
            <button type="button" class="link-button" aria-expanded={open()} onClick={() => setOpen(!open())}>
              {open() ? "Visa mindre" : "Visa mer"}
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

import { For, Show, createSignal } from "solid-js";
import type { Component } from "solid-js";
import type { Article } from "../types";
import { sourceByKey } from "../sources";

const dateFormat = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" });

// Long summaries are folded after this many points or characters
const MAX_POINTS = 4;
const MAX_CHARS = 320;

interface Props {
  article: Article;
  // Compact: the overview row at the top. Shorter summary, and a link to the source's list.
  compact?: boolean;
  onShowSource?: (key: string) => void;
}

const ArticleCard: Component<Props> = (props) => {
  const [open, setOpen] = createSignal(false);
  const a = () => props.article;
  const maxPoints = () => (props.compact ? 2 : MAX_POINTS);
  const maxChars = () => (props.compact ? 160 : MAX_CHARS);
  const long = () =>
    !props.compact && (a().summaryPoints.length > maxPoints() || a().summaryText.length > maxChars());
  const points = () => (open() ? a().summaryPoints : a().summaryPoints.slice(0, maxPoints()));
  const text = () =>
    open() || a().summaryText.length <= maxChars()
      ? a().summaryText
      : a().summaryText.slice(0, maxChars()).replace(/\s+\S*$/, "") + "…";

  return (
    <article class="card" classList={{ compact: !!props.compact }}>
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

      <Show when={long() || a().url || props.onShowSource}>
        <footer class="card-actions">
          <Show when={props.onShowSource}>
            {(show) => (
              <button type="button" class="link-button" onClick={() => show()(a().source)}>
                Fler från {a().sourceLabel}
              </button>
            )}
          </Show>
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

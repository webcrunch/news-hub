import { For, Show, createEffect } from "solid-js";
import type { Component } from "solid-js";
import type { Article } from "../types";
import { sourceByKey } from "../sources";
import { longDateFormat } from "./format";

interface Props {
  article: Article | null;
  onClose: () => void;
  onShowSource: (key: string) => void;
}

// The reading view: a modal <dialog> with the long version when there is one, else the short summary.
// Esc, the close button and a click outside the panel close it.
const Reader: Component<Props> = (props) => {
  let dialog: HTMLDialogElement | undefined;

  createEffect(() => {
    if (!dialog) return;
    if (props.article && !dialog.open) dialog.showModal();
    if (!props.article && dialog.open) dialog.close();
  });

  return (
    <dialog
      ref={dialog}
      class="reader"
      aria-labelledby="reader-title"
      onClose={() => props.onClose()}
      onClick={(e) => e.target === dialog && dialog?.close()}
    >
      <Show when={props.article}>
        {(a) => (
          <div class="reader-inner">
            <header class="reader-head">
              <span class="source">
                <span class="dot" style={{ background: sourceByKey(a().source).hue }} aria-hidden="true" />
                {a().sourceLabel}
                <Show when={a().date}>
                  {(d) => (
                    <>
                      <span aria-hidden="true">·</span>
                      <time datetime={d().toISOString()}>{longDateFormat.format(d())}</time>
                    </>
                  )}
                </Show>
              </span>
              <button type="button" class="icon-button" aria-label="Stäng" onClick={() => dialog?.close()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <h2 id="reader-title" class="reader-title">
              {a().title}
            </h2>

            <div class="reader-body">
              <Show
                when={a().longParagraphs.length || a().longPoints.length}
                fallback={
                  <Show
                    when={a().summaryPoints.length}
                    fallback={<p>{a().summaryText || "Ingen sammanfattning för det här utskicket."}</p>}
                  >
                    <ul class="points">
                      <For each={a().summaryPoints}>{(p) => <li>{p}</li>}</For>
                    </ul>
                  </Show>
                }
              >
                <For each={a().longParagraphs}>{(p) => <p>{p}</p>}</For>
                <Show when={a().longPoints.length}>
                  <ul class="points">
                    <For each={a().longPoints}>{(p) => <li>{p}</li>}</For>
                  </ul>
                </Show>
              </Show>
            </div>

            <footer class="reader-actions">
              <button type="button" class="button" onClick={() => props.onShowSource(a().source)}>
                Fler från {a().sourceLabel}
              </button>
              <Show when={a().url}>
                {(url) => (
                  <a class="button primary" href={url()} target="_blank" rel="noopener noreferrer">
                    Läs originalet <span aria-hidden="true">→</span>
                  </a>
                )}
              </Show>
            </footer>
          </div>
        )}
      </Show>
    </dialog>
  );
};

export default Reader;

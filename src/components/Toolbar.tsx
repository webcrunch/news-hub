import { For } from "solid-js";
import type { Component } from "solid-js";
import { sourceByKey } from "../sources";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  sources: { key: string; label: string; count: number }[];
  active: string; // "all" or a source key
  onActive: (key: string) => void;
  total: number;
}

const Toolbar: Component<Props> = (props) => (
  <section class="toolbar" aria-label="Filter">
    <label class="search">
      <span class="visually-hidden">Sök</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        placeholder="Sök i alla nyheter"
        value={props.search}
        onInput={(e) => props.onSearch(e.currentTarget.value)}
      />
    </label>

    <div class="chips" role="group" aria-label="Nyhetsbrev">
      <button type="button" class="chip" aria-pressed={props.active === "all"} onClick={() => props.onActive("all")}>
        Alla <span class="count">{props.total}</span>
      </button>
      <For each={props.sources}>
        {(s) => (
          <button type="button" class="chip" aria-pressed={props.active === s.key} onClick={() => props.onActive(s.key)}>
            <span class="dot" style={{ background: sourceByKey(s.key).hue }} aria-hidden="true" />
            {s.label} <span class="count">{s.count}</span>
          </button>
        )}
      </For>
    </div>
  </section>
);

export default Toolbar;

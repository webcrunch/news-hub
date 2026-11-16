import { For, Match, Show, Switch, createEffect, createMemo, createResource, createSignal } from "solid-js";
import ArticleCard from "./components/ArticleCard";
import Toolbar, { type SortKey } from "./components/Toolbar";
import ThemeToggle from "./components/ThemeToggle";
import { fetchArticles } from "./api";
import { SOURCES, sourceByKey } from "./sources";
import type { Article } from "./types";

const PAGE = 12;
const collator = new Intl.Collator("sv");

function matches(a: Article, q: string): boolean {
  if (!q) return true;
  const hay = [a.title, a.summaryText, ...a.summaryPoints, a.sourceLabel].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
}

export default function App() {
  const [articles, { refetch }] = createResource(() => fetchArticles());
  const [search, setSearch] = createSignal("");
  const [sort, setSort] = createSignal<SortKey>("newest");
  const [active, setActive] = createSignal("all");
  const [shown, setShown] = createSignal(PAGE);
  // Reading a failed resource throws, so everything else reads through this
  const list = () => (articles.state === "ready" ? articles() : []);

  // Back to the first page whenever the filter changes
  createEffect(() => {
    search();
    sort();
    active();
    setShown(PAGE);
  });

  const sources = createMemo(() => {
    const counts = new Map<string, number>();
    for (const a of list()) counts.set(a.source, (counts.get(a.source) ?? 0) + 1);
    // Fixed order from SOURCES, so a source keeps its place and colour when others disappear
    const known = SOURCES.filter((s) => counts.has(s.key)).map((s) => ({
      key: s.key,
      label: s.label,
      count: counts.get(s.key) ?? 0,
    }));
    const other = counts.get("other");
    return other ? [...known, { key: "other", label: sourceByKey("other").label, count: other }] : known;
  });

  const filtered = createMemo(() => {
    const q = search().trim();
    const rows = list().filter((a) => (active() === "all" || a.source === active()) && matches(a, q));
    const time = (a: Article) => a.date?.getTime() ?? 0;
    if (sort() === "title") return rows.sort((x, y) => collator.compare(x.title, y.title));
    if (sort() === "oldest") return rows.sort((x, y) => time(x) - time(y));
    return rows.sort((x, y) => time(y) - time(x));
  });

  const clearFilters = () => {
    setSearch("");
    setActive("all");
  };

  return (
    <div class="page">
      <header class="masthead">
        <div>
          <h1>NewsHub</h1>
          <p class="tagline">Utvecklarnyhetsbrev, sammanfattade av en lokal AI-modell.</p>
        </div>
        <ThemeToggle />
      </header>

      <Toolbar
        search={search()}
        onSearch={setSearch}
        sort={sort()}
        onSort={setSort}
        sources={sources()}
        active={active()}
        onActive={setActive}
        total={list().length}
      />

      <main>
        <Switch>
          <Match when={articles.loading}>
            <div class="grid" aria-busy="true" aria-label="Hämtar nyheter">
              <For each={[1, 2, 3, 4, 5, 6]}>{() => <div class="card skeleton" />}</For>
            </div>
          </Match>
          <Match when={articles.error}>
            <div class="notice" role="alert">
              <p>Nyheterna gick inte att hämta just nu.</p>
              <button type="button" class="button" onClick={() => refetch()}>
                Försök igen
              </button>
            </div>
          </Match>
          <Match when={filtered().length === 0}>
            <div class="notice">
              <p>Inga artiklar matchar filtret.</p>
              <button type="button" class="button" onClick={clearFilters}>
                Rensa filter
              </button>
            </div>
          </Match>
          <Match when={true}>
            <p class="result-count" aria-live="polite">
              Visar {Math.min(shown(), filtered().length)} av {filtered().length} artiklar
            </p>
            <div class="grid">
              <For each={filtered().slice(0, shown())}>{(a) => <ArticleCard article={a} />}</For>
            </div>
            <Show when={shown() < filtered().length}>
              <div class="more">
                <button type="button" class="button" onClick={() => setShown(shown() + PAGE)}>
                  Visa fler
                </button>
              </div>
            </Show>
          </Match>
        </Switch>
      </main>

      <footer class="page-footer">
        <p>Hämtas från Gmail med n8n, sammanfattas med Ollama och sparas i Postgres. De senaste 50 utskicken visas.</p>
      </footer>
    </div>
  );
}

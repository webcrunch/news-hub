import { For, Match, Show, Switch, createEffect, createMemo, createResource, createSignal, on, onCleanup } from "solid-js";
import ArticleCard from "./components/ArticleCard";
import Reader from "./components/Reader";
import Teaser from "./components/Teaser";
import Toolbar from "./components/Toolbar";
import ThemeToggle from "./components/ThemeToggle";
import { fetchFeed, fetchLatest } from "./api";
import { SOURCES, sourceByKey } from "./sources";
import type { Article } from "./types";

const PAGE = 24;
const SEARCH_DELAY = 350; // ms after the last key press

export default function App() {
  // Top: the newest mail of each newsletter
  const [latest, { refetch: refetchLatest }] = createResource(() => fetchLatest());
  const latestList = () => (latest.state === "ready" ? latest().articles : []);

  // Below: every mail, newest first, a page at a time from the server
  const [search, setSearch] = createSignal("");
  const [query, setQuery] = createSignal(""); // search, after the delay
  const [active, setActive] = createSignal("all");
  const [items, setItems] = createSignal<Article[]>([]);
  const [total, setTotal] = createSignal(0);
  const [loading, setLoading] = createSignal(true);
  const [failed, setFailed] = createSignal(false);
  const [reading, setReading] = createSignal<Article | null>(null); // the article in the reading view
  let request = 0; // only the newest request may write the list
  let feedTop: HTMLElement | undefined;

  createEffect(
    on(search, (s) => {
      const t = setTimeout(() => setQuery(s), SEARCH_DELAY);
      onCleanup(() => clearTimeout(t));
    }),
  );

  async function load(reset: boolean) {
    const id = ++request;
    setLoading(true);
    setFailed(false);
    try {
      const page = await fetchFeed({ source: active(), query: query(), offset: reset ? 0 : items().length, limit: PAGE });
      if (id !== request) return;
      setItems(reset ? page.articles : [...items(), ...page.articles]);
      setTotal(page.total);
    } catch {
      if (id === request) setFailed(true);
    } finally {
      if (id === request) setLoading(false);
    }
  }

  // A new filter starts the list over
  createEffect(on([active, query], () => load(true)));

  const sources = createMemo(() => {
    const counts = latest.state === "ready" ? latest().counts : new Map<string, number>();
    // Fixed order from SOURCES, so a source keeps its place and colour
    const known = SOURCES.filter((s) => counts.has(s.key)).map((s) => ({ key: s.key, label: s.label, count: counts.get(s.key) ?? 0 }));
    const other = counts.get("other");
    return other ? [...known, { key: "other", label: sourceByKey("other").label, count: other }] : known;
  });
  const allCount = () => sources().reduce((n, s) => n + s.count, 0);

  const showSource = (key: string) => {
    setReading(null);
    setSearch("");
    setQuery("");
    setActive(key);
    feedTop?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    setSearch("");
    setQuery("");
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

      <main>
        <section class="latest" aria-labelledby="latest-title">
          <h2 id="latest-title" class="section-title">
            Senaste från varje nyhetsbrev
          </h2>
          <Switch>
            <Match when={latest.loading}>
              <div class="latest-row" aria-busy="true" aria-label="Hämtar senaste">
                <For each={[1, 2, 3, 4]}>{() => <div class="card teaser skeleton" />}</For>
              </div>
            </Match>
            <Match when={latest.error}>
              <div class="notice" role="alert">
                <p>De senaste utskicken gick inte att hämta just nu.</p>
                <button type="button" class="button" onClick={() => refetchLatest()}>
                  Försök igen
                </button>
              </div>
            </Match>
            <Match when={true}>
              <div class="latest-row">
                <For each={latestList()}>{(a) => <Teaser article={a} onOpen={setReading} />}</For>
              </div>
            </Match>
          </Switch>
        </section>

        <section class="feed" aria-labelledby="feed-title" ref={feedTop}>
          <h2 id="feed-title" class="section-title">
            Alla nyheter
          </h2>
          <Toolbar
            search={search()}
            onSearch={setSearch}
            sources={sources()}
            active={active()}
            onActive={setActive}
            total={allCount()}
          />

          <Switch>
            <Match when={failed() && items().length === 0}>
              <div class="notice" role="alert">
                <p>Nyheterna gick inte att hämta just nu.</p>
                <button type="button" class="button" onClick={() => load(true)}>
                  Försök igen
                </button>
              </div>
            </Match>
            <Match when={loading() && items().length === 0}>
              <div class="grid" aria-busy="true" aria-label="Hämtar nyheter">
                <For each={[1, 2, 3, 4, 5, 6]}>{() => <div class="card skeleton" />}</For>
              </div>
            </Match>
            <Match when={items().length === 0}>
              <div class="notice">
                <p>Inga artiklar matchar filtret.</p>
                <button type="button" class="button" onClick={clearFilters}>
                  Rensa filter
                </button>
              </div>
            </Match>
            <Match when={true}>
              <p class="result-count" aria-live="polite">
                Visar {items().length} av {total()} artiklar
              </p>
              <div class="grid">
                <For each={items()}>{(a) => <ArticleCard article={a} onOpen={setReading} />}</For>
              </div>
              <Show when={items().length < total() || failed()}>
                <div class="more">
                  <Show when={failed()}>
                    <p class="result-count" role="alert">
                      Fler artiklar gick inte att hämta.
                    </p>
                  </Show>
                  <button type="button" class="button" disabled={loading()} onClick={() => load(false)}>
                    {loading() ? "Hämtar…" : failed() ? "Försök igen" : "Visa fler"}
                  </button>
                </div>
              </Show>
            </Match>
          </Switch>
        </section>
      </main>

      <Reader article={reading()} onClose={() => setReading(null)} onShowSource={showSource} />

      <footer class="page-footer">
        <p>Hämtas från Gmail med n8n, sammanfattas med Ollama och sparas i Postgres.</p>
      </footer>
    </div>
  );
}

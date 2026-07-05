import { createSignal, createMemo, createEffect, onMount, For, Show } from "solid-js";
import ArticleCard from "./components/ArticleCard";
import FilterBar from "./components/FilterBar";
import type { Article } from "./types";

function App() {
  const [articles, setArticles] = createSignal<Article[]>([]);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [activeSender, setActiveSender] = createSignal("Alla");
  const [sortBy, setSortBy] = createSignal("created_at");
  const [sortOrder, setSortOrder] = createSignal("desc");

  // Paginering
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 5;

  // Återställ till sida 1 när sökning eller filter ändras
  createEffect(() => {
    searchTerm();
    activeSender();
    sortBy();
    sortOrder();
    setCurrentPage(1);
  });

  function cleanSenderField(senderRaw: any): string {
    if (!senderRaw) return "daily.dev";

    if (typeof senderRaw === "object") {
      return senderRaw.name || senderRaw.address || "daily.dev";
    }

    const str = String(senderRaw).trim();

    if (!str.startsWith("{") && !str.startsWith('"{')) {
      if (str.includes("informer@daily.dev")) return "daily.dev";
      return str;
    }

    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed.name || parsed.address || "daily.dev";
      }

      if (typeof parsed === "string") {
        const doubleParsed = JSON.parse(parsed);
        return doubleParsed.name || doubleParsed.address || "daily.dev";
      }
    } catch (e) {
      const nameMatch = str.match(/"name"\s*:\s*"([^"]+)"/);
      if (nameMatch) return nameMatch[1];

      const addressMatch = str.match(/"address"\s*:\s*"([^"]+)"/);
      if (addressMatch && addressMatch[1].includes("daily.dev")) return "daily.dev";
    }

    return "daily.dev";
  }

  onMount(async () => {
    try {
      const limit = 100;
      const offset = 0;
      const res = await fetch(`https://jarllindquist.com/n8n/webhook/043557d6-47e3-4f61-94f2-11ffcf2c8fa9/news/all/${limit}/${offset}`);
      const data = await res.json();

      const cleanArticles = data.map((article: any) => ({
        ...article,
        sender: cleanSenderField(article.sender)
      }));

      setArticles(cleanArticles);
      console.log("Antal artiklar laddade:", data.length);
    } catch (error) {
      console.error("Kunde inte hämta nyheter:", error);
    }
  });

  const filteredArticles = createMemo(() => {
    return articles()
      .filter(article => {
        if (activeSender() !== "Alla" && article.sender !== activeSender()) return false;

        if (searchTerm()) {
          const search = searchTerm().toLowerCase();
          return (
            article.title?.toLowerCase().includes(search) ||
            article.summary?.toLowerCase().includes(search) ||
            article.author?.toLowerCase().includes(search)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortBy() as keyof Article];
        let valB = b[sortBy() as keyof Article];

        if (sortBy() === "created_at") {
          valA = new Date(valA as string).getTime();
          valB = new Date(valB as string).getTime();
        }

        if (valA < valB) return sortOrder() === "desc" ? 1 : -1;
        if (valA > valB) return sortOrder() === "desc" ? -1 : 1;
        return 0;
      });
  });

  const paginatedArticles = createMemo(() => {
    const start = (currentPage() - 1) * itemsPerPage;
    return filteredArticles().slice(start, start + itemsPerPage);
  });

  const totalPages = createMemo(() => Math.ceil(filteredArticles().length / itemsPerPage));

  const senders = createMemo(() => ["Alla", ...new Set(articles().map(a => a.sender))]);

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <header class="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-10 shadow-sm">
        <h1 class="text-xl font-bold tracking-tight text-slate-800">📰 NewsHub Reader</h1>
      </header>

      <div class="flex flex-col md:flex-row gap-8 max-w-[1600px] mx-auto p-6 md:p-8">

        {/* SIDOMENYN: Ökad från w-64 till w-80 för att förhindra krockar */}
        <div class="w-full md:w-80 shrink-0">
          <FilterBar
            senders={senders()}
            searchTerm={searchTerm()}
            setSearchTerm={setSearchTerm}
            activeSender={activeSender()}
            setActiveSender={setActiveSender}
            sortBy={sortBy()}
            setSortBy={setSortBy}
            sortOrder={sortOrder()}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* HUVUDDELEN */}
        <main class="flex-1 flex flex-col gap-6 min-w-0">
          <div class="text-sm text-slate-500 font-medium">
            {filteredArticles().length > 0
              ? `Visar ${(currentPage() - 1) * itemsPerPage + 1}–${Math.min(currentPage() * itemsPerPage, filteredArticles().length)} av ${filteredArticles().length} artiklar`
              : "Inga artiklar hittades"}
          </div>

          {/* RUTNÄT: 1 kolumn på mobil/mindre skärm, 2 på laptop (lg), 3 på stor extern skärm (xl) */}
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <For each={paginatedArticles()}>
              {(article) => <ArticleCard article={article} />}
            </For>
          </div>

          {/* Pagineringskontroller */}
          <Show when={totalPages() > 1}>
            <div class="flex items-center justify-between border-t border-slate-200 pt-6 mt-2">
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage() === 1}
                class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                ← Föregående
              </button>

              <span class="text-sm font-medium text-slate-600">
                Sida <span class="font-bold text-slate-900">{currentPage()}</span> av <span class="font-bold text-slate-900">{totalPages()}</span>
              </span>

              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages(), p + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage() === totalPages()}
                class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Nästa →
              </button>
            </div>
          </Show>
        </main>
      </div>
    </div>
  );
}

export default App;
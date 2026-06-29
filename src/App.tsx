import { createSignal, createMemo, onMount, For } from "solid-js";
import ArticleCard from "./components/ArticleCard";
import FilterBar from "./components/FilterBar";

import type { Article } from "./types";
// Mock-datan (enkel definition, rensad från dubbletter)
const mockArticles: any[] = [
  {
    "id": 1474,
    "url": "https://app.daily.dev/posts/dSvHbLAq3?utm_source=notification&utm_medium=email&utm_campaign=digest",
    "title": "Who said Bun ??? :-)\n\nI found a prototype pollution vulnerability in the server-side JavaScript runtime Bun. The security vulnerability is now addressed and fixed by Jarred Sumner and the Bun team through a newly released version of Bun. Curious to learn more about the vulnerability and how it was fixed? Read on.",
    "author": "Node.js developers",
    "summary": "* En prototypeföroreningssvårighet upptäcktes i server-sidens JavaScript-ramverk Bun.\n* Själva svårlösningen av föroreningar i prototypen kan leda till oavsiktlig ändring av programmet.\n* Prototypförorening är ett särskilt säkerhetsproblem i JavaScript där attacker kan ändra den övergripande prototypen, vilket kan resultera i felaktig programanvändning.\n* Själva svårlösningen av föroreningar i prototypen har utförts av Jarred Sumner och Bun-teamet genom en ny releaseversion av Bun (1.1.30).",
    "sender": "{\"{\\\"address\\\":\\\"informer@daily.dev\\\",\\\"name\\\":\\\"daily.dev\\\"}\"}",
    "created_at": "2026-06-28T14:40:57.203Z"
  },
  {
    "id": 2,
    "url": "https://app.daily.dev/em/t/c?r=%2Fposts%2FcoqLi3SH8%3Futm_source%3Dnotification%26utm_medium%3Demail%26utm_campaign%3Ddigest&link_id=CIO--LINKID",
    "title": "Shai-Hulud Reaches PyPI: The Hades Wave That Runs Before You Import It",
    "author": "Bobby Iliev",
    "summary": "* Shai-Hulud worm har nått PyPI med Hades-branchen.\n* Malicious code hittas i 37 wheel-artefakter och 19 Python-paket.\n* Hades använder en .pth startup hook för att köra automatiskt vid tolkningsstart, utan behov av import.\n* Payload laddar ned Bun runtime och kör ett obfuscerat JavaScript-stealer som ransakar GitHub-tokens, PyPI/npm-publikationskreditorer, AWS/GCP/Azure/Kubernetes-geheimlösa data, SSH-lägenheter och AI-verktygskonfigurationer.\n* Stulna data skickas till attacker-skapade offentliga GitHub-repo.",
    "sender": "tldr",
    "created_at": "2026-06-09T08:26:31.584Z"
  },
  {
    "id": 24,
    "url": "https://app.daily.dev/posts/l8v6L9b1l?utm_source=notification&utm_medium=email&utm_campaign=digest",
    "title": "Stop Chasing Hype: Why I Chose Postgres Over ‘New-Age’ Databases",
    "author": "Ruby Flow",
    "summary": "• Författaren diskuterar favoriseringen av PostgreSQL som standarddatabas i stället för \"nya-trender\"-databaser.\n• Vissa av fördelarna med PostgreSQL är sin flexibilitet (JSONB, fulltext sökning, pgvector och key-value lagring).\n• Databasen uppfyller ACID-kompatibilitetskraven.\n• Postgres har ett stort ekosystem som bidrar till dess popularitet.\n• Rails 8:s 'Solid' rörelsen (Solid Queue, Solid Cache, Solid Cable) visar på Postgres potential att ersätta Redis och andra externa avhängigheter, vilket reducerar infrastruktursammanhanget till bara Linux + Postgres.",
    "sender": "bruno",
    "created_at": "2026-06-09T09:47:40.813Z"
  }
];

function transformArticles(rawArticles: any[]): Article[] {
  return rawArticles.map(article => {
    const cleanTitle = article.title?.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    let cleanSender = 'daily.dev';
    try {
      if (typeof article.sender === 'string') {
        const cleanJsonStr = article.sender.replace(/^"{|}"$/g, '').replace(/\\"/g, '"');
        const parsed = JSON.parse(cleanJsonStr);
        cleanSender = parsed.name || parsed.address || 'daily.dev';
      }
    } catch (e) {
      if (article.sender?.includes('tldr')) cleanSender = 'TLDR';
      else if (article.sender?.includes('bruno')) cleanSender = 'Bruno';
    }

    return {
      ...article,
      title: cleanTitle,
      sender: cleanSender
    };
  });
}

function App() {
  const [rawArticles, setRawArticles] = createSignal<Article[]>([]);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [activeSender, setActiveSender] = createSignal("Alla");
  const [sortBy, setSortBy] = createSignal("created_at");
  const [sortOrder, setSortOrder] = createSignal("desc");

  // Ändrad onMount: Vi läser direkt från mockArticles istället för fetch så länge!
  onMount(() => {
    setRawArticles(transformArticles(mockArticles));
  });

  const filteredArticles = createMemo(() => {
    return rawArticles()
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

  const senders = createMemo(() => ["Alla", ...new Set(rawArticles().map(a => a.sender))]);

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <header class="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-10 shadow-sm">
        <h1 class="text-xl font-bold tracking-tight text-slate-800">📰 NewsHub Reader</h1>
      </header>

      <div class="flex gap-8 max-w-[1400px] mx-auto p-8">
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

        <main class="flex-1 flex flex-col gap-4">
          <div class="text-sm text-slate-500 font-medium mb-2">
            {/* 1. ÄNDRAT: Lägg till () här */}
            Visar {filteredArticles().length} av {rawArticles().length} artiklar
          </div>

          <div class="flex flex-col gap-4">
            {/* 2. ÄNDRAT: Lägg till () i din each-prop här */}
            <For each={filteredArticles()}>
              {(article) => <ArticleCard article={article} />}
            </For>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
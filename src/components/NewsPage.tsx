import { createSignal, createMemo, onMount, For } from "solid-js";
import ArticleCard from "./ArticleCard";
import FilterBar from "./FilterBar";
import type { Article } from "../types";

const NewsPage = () => {
    const [articles, setArticles] = createSignal<Article[]>([]);
    const [searchTerm, setSearchTerm] = createSignal("");
    const [activeSender, setActiveSender] = createSignal("Alla");
    const [sortBy, setSortBy] = createSignal("publishedAt");
    const [sortOrder, setSortOrder] = createSignal("desc");

    onMount(async () => {
        try {
            const res = await fetch('https://jarllindquist.com/n8n/webhook/news/all');
            const data = await res.json();
            console.log(data);
            setArticles(data);
        } catch (error) {
            console.error("Kunde inte hämta nyheter:", error);
        }
    });

    const senders = createMemo(() => ["Alla", ...new Set(articles().map(a => a.source))]);

    // HÄR är logiken som löser ditt fel!
    const filteredArticles = createMemo(() => {
        let list = articles();

        // 1. Filtrera på sökord
        if (searchTerm()) {
            list = list.filter(a =>
                a.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
                a.summary.toLowerCase().includes(searchTerm().toLowerCase())
            );
        }

        // 2. Filtrera på källa
        if (activeSender() !== "Alla") {
            list = list.filter(a => a.source === activeSender());
        }

        // 3. Sortera
        return list.sort((a, b) => {
            const valA = a[sortBy() as keyof Article];
            const valB = b[sortBy() as keyof Article];

            if (sortOrder() === "asc") return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });
    });

    return (
        <div class="flex gap-8 p-8 max-w-7xl mx-auto">
            <FilterBar
                senders={senders()}
                searchTerm={searchTerm()} setSearchTerm={setSearchTerm}
                activeSender={activeSender()} setActiveSender={setActiveSender}
                sortBy={sortBy()} setSortBy={setSortBy}
                sortOrder={sortOrder()} setSortOrder={setSortOrder}
            />
            <div class="flex-1 flex flex-col gap-4">
                <For each={filteredArticles()}>
                    {(article) => <ArticleCard article={article} />}
                </For>
            </div>
        </div>
    );
};

export default NewsPage;
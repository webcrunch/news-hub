import { For } from "solid-js";
import type { Component } from "solid-js";

interface FilterBarProps {
    senders: string[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    activeSender: string;
    setActiveSender: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    sortOrder: string;
    setSortOrder: (value: string) => void;
}
// const sortedArticles = articles.sort((a, b) =>
//     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
// );

const getBadgeColor = (sender: string | undefined) => {
    if (!sender) return "bg-gray-100 text-gray-800 border-gray-200";
    const s = sender.toLowerCase();
    if ((s.includes("mira mitchell")) || (s.includes("mira from codeanywhere")) || (s.includes("niko from codeanywhere"))) return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("daily.dev")) return "bg-purple-100 text-purple-800 border-purple-200";
    if (s.includes("piotr's techblog")) return "bg-pink-100 text-pink-800 border-black-200";
    if (s.includes("tldr")) return "bg-orange-100 text-orange-800 border-orange-200";
    if (s.includes("bruno")) return "bg-yellow-100 text-yellow-800 border-yellow-200";

    return "bg-blue-100 text-blue-800 border-blue-200";
};

const formatSenderBadge = (sender: any) => {
    if (!sender) return <span class="text-gray-500">Okänd</span>;

    const parts = sender.split('<');
    const name = parts[0].trim() || "Okänd";
    // Plocka ut e-posten om den finns, annars tom sträng
    const email = parts.length > 1 ? parts[1].replace('>', '').trim() : "";

    return (
        <div class="mb-4">
            {/* Själva färg-boxen/pillret med namnet */}
            <span class={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(sender)}`}>
                {name}
            </span>

            {/* E-postadressen på en ny rad under, lite mer diskret */}
            {email && (
                <>
                    <br />
                    <span class="inline-block mt-1 text-xs text-gray-500">
                        {email}
                    </span>
                </>
            )}
        </div>
    );
};
const FilterBar: Component<FilterBarProps> = (props) => {
    return (
        <aside class="w-80 bg-white rounded-xl border border-slate-200 p-6 h-fit shrink-0 shadow-sm flex flex-col gap-6">
            {/* Sökfält */}
            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Sök i flödet</label>
                <div class="relative">
                    <input
                        type="text"
                        value={props.searchTerm}
                        onInput={(e) => props.setSearchTerm(e.currentTarget.value)}
                        placeholder="Sök på titel, innehåll..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                    {props.searchTerm && (
                        <button
                            onClick={() => props.setSearchTerm("")}
                            class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-sm"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Källor / Senders */}
            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Nyhetsbrev</label>
                <div class="flex flex-col gap-1">
                    <For each={props.senders}>
                        {(sender) => (
                            <button
                                onClick={() => props.setActiveSender(sender)}
                                class={`w - full text - left px - 3 py - 2 rounded - lg text - sm font - medium transition - colors ${props.activeSender === sender
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >

                                {formatSenderBadge(sender)}
                            </button>
                        )}
                    </For>
                </div>
            </div>

            {/* Sortering */}
            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Sortera efter</label>
                <div class="flex gap-2">
                    <select
                        value={props.sortBy}
                        onChange={(e) => props.setSortBy(e.currentTarget.value)}
                        class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                        <option value="created_at">Datum mottaget</option>
                        <option value="title">Titel</option>
                    </select>

                    <button
                        onClick={() => props.setSortOrder(props.sortOrder === "desc" ? "asc" : "desc")}
                        class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors font-mono"
                    >
                        {props.sortOrder === "desc" ? "▼" : "▲"}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default FilterBar;
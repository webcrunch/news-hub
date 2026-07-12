import type { Component } from "solid-js";
import type { Article } from "../types";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: Component<ArticleCardProps> = (props) => {
    const getSummaryPoints = (summaryText: string): string[] => {
        if (!summaryText) return [];
        return summaryText
            .split("\n")
            .map(point => point.replace(/^[\s•*]+/, "").trim())
            .filter(point => point.length > 0);
    };

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

    return (
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
            <div>
                <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div class="flex items-center gap-3">
                        {/* <span class="text-sm text-slate-500 font-medium">
                            {props.article.author || "Okänd"}
                        </span> */}
                        <span class={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeColor(props.article.sender || "Okänd")}`}>
                            {props.article.sender || "Okänd"}
                        </span>

                    </div>
                    <span class="text-xs text-slate-400">

                        {new Date(props.article.sent_at || props.article.created_at).toLocaleDateString('sv-SE')}
                    </span>                </div>

                <div class="article-card mb-4">
                    <h2 style="color: #000000;" class="text-lg font-bold mb-2 leading-tight tracking-tight">
                        {props.article.title}
                    </h2>
                    <br />
                    <br />
                    <span class="date block text-xs text-slate-400 mb-2">{props.article.displayDate}</span>
                    <p class="text-sm text-slate-600 mb-3">{props.article.summary}</p>
                </div>

                <ul class="space-y-1.5 mb-6">
                    {getSummaryPoints(props.article.summary).map((point) => (
                        <li class="text-sm text-slate-600 flex items-start gap-2 leading-relaxed">
                            <span class="text-blue-500 select-none mt-1 text-xs">◆</span>
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div class="flex justify-end pt-4 border-t border-slate-100 mt-auto">
                <a
                    href={props.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors gap-1 group"
                >
                    Läs artikel
                    <span class="transform group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
            </div>
        </div>
    );
};

export default ArticleCard;
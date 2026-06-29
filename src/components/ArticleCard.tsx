import type { Component } from "solid-js";
import type { Article } from "../types";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: Component<ArticleCardProps> = (props) => {
    // Dela upp sammanfattningen på radbrytningar och städa bort punkter
    const getSummaryPoints = (summaryText: string): string[] => {
        if (!summaryText) return [];
        return summaryText
            .split("\n")
            .map(point => point.replace(/^[\s•*]+/, "").trim())
            .filter(point => point.length > 0);
    };

    // Dynamisk färg baserad på nyhetsbrev
    const getBadgeColor = (sender: string) => {
        switch (sender.toLowerCase()) {
            case "daily.dev": return "bg-purple-100 text-purple-800 border-purple-200";
            case "tldr": return "bg-orange-100 text-orange-800 border-orange-200";
            case "bruno": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default: return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    return (
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div class="flex items-center gap-3">
                    <span class={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeColor(props.article.sender)}`}>
                        {props.article.sender}
                    </span>
                    <span class="text-sm text-slate-500 font-medium">
                        av {props.article.author || "Okänd"}
                    </span>
                </div>
                <span class="text-xs text-slate-400">
                    {new Date(props.article.created_at).toLocaleDateString('sv-SE')}
                </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {props.article.title}
            </h3>

            <ul class="space-y-1.5 mb-4">
                {getSummaryPoints(props.article.summary).map((point) => (
                    <li class="text-sm text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span class="text-blue-500 select-none mt-1 text-xs">◆</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>

            <div class="flex justify-end">
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
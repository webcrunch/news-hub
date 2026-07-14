// utils/badgeUtils.ts

// Vi definierar en konfigurationstabell
const BADGE_CONFIG = [
    { keywords: ["mira mitchell", "mira from codeanywhere", "niko from codeanywhere"], color: "bg-green-100 text-green-800 border-green-200" },
    { keywords: ["daily.dev"], color: "bg-purple-100 text-purple-800 border-purple-200" },
    { keywords: ["piotr's techblog"], color: "bg-pink-100 text-pink-800 border-pink-200" }, // Fixade 'border-black-200' till 'border-pink-200' för konsistens
    { keywords: ["tldr"], color: "bg-orange-100 text-orange-800 border-orange-200" },
    { keywords: ["bruno"], color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { keywords: ["greg sidelnikov"], color: "bg-red-100 text-red-800 border-red-200" },
];

export const getBadgeColor = (sender: string | undefined): string => {
    if (!sender) return "bg-gray-100 text-gray-800 border-gray-200";

    const s = sender.toLowerCase();

    // Gå igenom konfigurationen
    for (const item of BADGE_CONFIG) {
        if (item.keywords.some(keyword => s.includes(keyword))) {
            return item.color;
        }
    }

    // Default-färg
    return "bg-blue-100 text-blue-800 border-blue-200";
};
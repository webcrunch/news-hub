export interface Article {
    id: number;
    url: string;
    sender: string;
    title: string;
    author: string;
    created_at: Date;
    sent_at: Date;
    summary: string;
    source: string;      // Vi byter ut 'sender' mot 'source' (som du döpte det till i n8n)
    publishedAt: string; // Vi använder det nya fältet
    displayDate: string; // Det formaterade datumet
    category: string;    // Det nya kategorifältet
}
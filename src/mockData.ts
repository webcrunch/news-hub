import { Article } from "./types";

export const mockArticles: any[] = [
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
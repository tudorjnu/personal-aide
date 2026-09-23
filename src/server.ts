import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createApp } from "./app.ts";

const PORT = Number(process.env.PORT ?? 8000);
const DB_PATH = process.env.READINGLIST_DB ?? "data/readinglist.db";

mkdirSync(dirname(DB_PATH), { recursive: true });

const server = createApp(DB_PATH);
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Reading list at http://127.0.0.1:${PORT}`);
});
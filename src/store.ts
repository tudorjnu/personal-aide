import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

export interface ListRow {
  id: string;
  title: string;
  created_at: string;
}

export interface ItemRow {
  id: string;
  list_id: string;
  title: string;
  url: string | null;
  read: number;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS lists (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS items (
  id      TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title   TEXT NOT NULL,
  url     TEXT,
  read    INTEGER NOT NULL DEFAULT 0
);
`;

export class Store {
  #db: DatabaseSync;

  constructor(path: string) {
    this.#db = new DatabaseSync(path);
    this.#db.exec(SCHEMA);
  }

  // -- lists ----------------------------------------------------------

  addList(title: string): ListRow | undefined {
    const id = randomUUID().slice(0, 8);
    this.#db
      .prepare("INSERT INTO lists (id, title) VALUES (?, ?)")
      .run(id, title);
    return this.getList(id);
  }

  getList(id: string): ListRow | undefined {
    return this.#db
      .prepare("SELECT * FROM lists WHERE id = ?")
      .get(id) as ListRow | undefined;
  }

  lists(): ListRow[] {
    return this.#db
      .prepare("SELECT * FROM lists ORDER BY created_at DESC")
      .all() as ListRow[];
  }

  // -- items ----------------------------------------------------------

  addItem(
    listId: string,
    title: string,
    url: string | null,
  ): ItemRow | undefined {
    const id = randomUUID().slice(0, 8);
    this.#db
      .prepare(
        "INSERT INTO items (id, list_id, title, url) VALUES (?, ?, ?, ?)",
      )
      .run(id, listId, title, url);
    return this.getItem(id);
  }

  getItem(id: string): ItemRow | undefined {
    return this.#db
      .prepare("SELECT * FROM items WHERE id = ?")
      .get(id) as ItemRow | undefined;
  }

  items(listId: string): ItemRow[] {
    return this.#db
      .prepare("SELECT * FROM items WHERE list_id = ? ORDER BY rowid DESC")
      .all(listId) as ItemRow[];
  }

  setRead(id: string, read: boolean): ItemRow | undefined {
    const result = this.#db
      .prepare("UPDATE items SET read = ? WHERE id = ?")
      .run(Number(read), id);
    return result.changes > 0 ? this.getItem(id) : undefined;
  }
}
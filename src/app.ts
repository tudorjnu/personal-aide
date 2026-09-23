import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { Store } from "./store.ts";

const STYLE = `
body { font-family: system-ui, sans-serif; margin: 2rem auto;
       max-width: 40rem; color: #1a1a2e; }
header a { text-decoration: none; color: #1a1a2e; font-weight: 700; }
ul { list-style: none; padding: 0; }
ul li { padding: .4rem 0; border-bottom: 1px solid #eee; }
.read { color: #9aa; text-decoration: line-through; }
form.inline { display: inline; margin: 0; }
input[type=text] { padding: .3rem; }
button { padding: .3rem .7rem; }
`;

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function page(title: string, body: string): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>${esc(title)}</title>
<style>${STYLE}</style></head>
<body><header><a href="/">Reading List</a></header>${body}</body>
</html>`;
}

async function readForm(req: IncomingMessage): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}

interface Route {
  method: "GET" | "POST";
  pattern: RegExp;
  handler: (
    req: IncomingMessage,
    res: ServerResponse,
    params: Record<string, string>,
  ) => Promise<void>;
}

export function createApp(dbPath: string): Server {
  const store = new Store(dbPath);

  function html(res: ServerResponse, status: number, body: string): void {
    res.writeHead(status, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  }

  function redirect(res: ServerResponse, location: string): void {
    res.writeHead(303, { location });
    res.end();
  }

  const routes: Route[] = [
    {
      method: "GET",
      pattern: /^\/$/,
      handler: async (_req, res) => {
        const rows = store
          .lists()
          .map(
            (l) => `<li><a href="/lists/${l.id}">${esc(l.title)}</a></li>`,
          )
          .join("");
        html(
          res,
          200,
          page(
            "Reading List",
            `<h1>My reading lists</h1>
             <form method="post" action="/lists">
               <input type="text" name="title" placeholder="New list title">
               <button>Create</button>
             </form>
             <ul>${rows || "<li>No lists yet.</li>"}</ul>`,
          ),
        );
      },
    },
    {
      method: "POST",
      pattern: /^\/lists$/,
      handler: async (req, res) => {
        const form = await readForm(req);
        const title = (form.get("title") ?? "").trim();
        const record = title ? store.addList(title) : undefined;
        redirect(res, record ? `/lists/${record.id}` : "/");
      },
    },
    {
      method: "GET",
      pattern: /^\/lists\/(?<id>\w+)$/,
      handler: async (_req, res, params) => {
        const record = store.getList(params.id);
        if (!record) {
          html(res, 404, page("Not found", "<h1>404, no such list</h1>"));
          return;
        }
        const rows = store
          .items(record.id)
          .map((item) => {
            const css = item.read ? "read" : "";
            const title = item.url
              ? `<a href="${esc(item.url)}">${esc(item.title)}</a>`
              : esc(item.title);
            const label = item.read ? "unread" : "read";
            return `<li class="${css}">${title}
              <form method="post" action="/items/${item.id}/read"
                    class="inline"><button>${label}</button></form></li>`;
          })
          .join("");
        html(
          res,
          200,
          page(
            record.title,
            `<h1>${esc(record.title)}</h1>
             <ul>${rows || "<li>Nothing saved yet.</li>"}</ul>
             <form method="post" action="/lists/${record.id}/items">
               <input type="text" name="title" placeholder="Article title">
               <input type="text" name="url" placeholder="Link, optional">
               <button>Add</button>
             </form>`,
          ),
        );
      },
    },
    {
      method: "POST",
      pattern: /^\/lists\/(?<id>\w+)\/items$/,
      handler: async (req, res, params) => {
        const form = await readForm(req);
        const title = (form.get("title") ?? "").trim();
        const url = (form.get("url") ?? "").trim() || null;
        if (title && store.getList(params.id)) {
          store.addItem(params.id, title, url);
        }
        redirect(res, `/lists/${params.id}`);
      },
    },
    {
      method: "POST",
      pattern: /^\/items\/(?<id>\w+)\/read$/,
      handler: async (_req, res, params) => {
        const item = store.getItem(params.id);
        if (!item) {
          redirect(res, "/");
          return;
        }
        store.setRead(item.id, !item.read);
        redirect(res, `/lists/${item.list_id}`);
      },
    },
  ];

  return createServer(async (req, res) => {
    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? "localhost"}`,
    );
    for (const route of routes) {
      if (route.method !== req.method) continue;
      const match = route.pattern.exec(url.pathname);
      if (!match) continue;
      try {
        await route.handler(req, res, match.groups ?? {});
      } catch (error) {
        html(
          res,
          500,
          page(
            "Error",
            `<h1>Something went wrong</h1><pre>${esc(String(error))}</pre>`,
          ),
        );
      }
      return;
    }
    html(res, 404, page("Not found", "<h1>404</h1>"));
  });
}
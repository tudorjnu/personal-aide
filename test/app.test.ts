import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { Server } from "node:http";
import { createApp } from "../src/app.ts";
import { Store } from "../src/store.ts";

async function withServer(fn: (base: string) => Promise<void>): Promise<void> {
  const server: Server = createApp(":memory:");
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("store roundtrip: list, item, read state", () => {
  const store = new Store(":memory:");
  const list = store.addList("To read");
  assert.equal(list?.title, "To read");
  const item = store.addItem(list!.id, "An article", "https://example.com");
  assert.equal(item?.read, 0);
  const updated = store.setRead(item!.id, true);
  assert.equal(updated?.read, 1);
  assert.equal(store.items(list!.id)[0]?.title, "An article");
});

test("store returns nothing for unknown records", () => {
  const store = new Store(":memory:");
  assert.equal(store.getList("nope"), undefined);
  assert.equal(store.getItem("nope"), undefined);
});

test("web: create and view a list", async () => {
  await withServer(async (base) => {
    const resp = await fetch(`${base}/lists`, {
      method: "POST",
      body: new URLSearchParams({ title: "Research" }),
      redirect: "manual",
    });
    assert.equal(resp.status, 303);
    const location = resp.headers.get("location") ?? "";
    assert.match(location, /^\/lists\//);
    const body = await (await fetch(base + location)).text();
    assert.match(body, /Research/);
  });
});

test("web: add an item and toggle it read", async () => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/lists`, {
      method: "POST",
      body: new URLSearchParams({ title: "Weekend" }),
      redirect: "manual",
    });
    const listUrl = base + (created.headers.get("location") ?? "");
    await fetch(`${listUrl}/items`, {
      method: "POST",
      body: new URLSearchParams({
        title: "Deep work essay",
        url: "https://example.com/dw",
      }),
      redirect: "manual",
    });
    const page = await (await fetch(listUrl)).text();
    assert.match(page, /Deep work essay/);
    const itemId = /\/items\/(\w+)\/read/.exec(page)?.[1];
    assert.ok(itemId);
    await fetch(`${base}/items/${itemId}/read`, {
      method: "POST",
      redirect: "manual",
    });
    const after = await (await fetch(listUrl)).text();
    assert.match(after, /class="read"/);
  });
});

test("web: unknown list gives a 404", async () => {
  await withServer(async (base) => {
    const resp = await fetch(`${base}/lists/does-not-exist`);
    assert.equal(resp.status, 404);
  });
});
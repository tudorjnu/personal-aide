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

test("store roundtrip: share lifecycle", () => {
  const store = new Store(":memory:");
  const list = store.addList("Shared reading");
  const share = store.addShare(list!.id);
  assert.ok(share);
  assert.match(share!.token, /^[a-f0-9]{32}$/);
  assert.ok(new Date(share!.expires_at) > new Date(Date.now() + 29 * 24 * 60 * 60 * 1000));
  assert.equal(store.getShareByList(list!.id)?.token, share!.token);
  assert.equal(store.getShareByToken(share!.token)?.list_id, list!.id);
  const again = store.addShare(list!.id);
  assert.equal(again?.token, share!.token);
  assert.ok(store.deleteList(list!.id));
  assert.equal(store.getShareByToken(share!.token), undefined);
  assert.equal(store.getShareByList(list!.id), undefined);
});

test("web: share a list and view it read-only", async () => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/lists`, {
      method: "POST",
      body: new URLSearchParams({ title: "Shared reading" }),
      redirect: "manual",
    });
    const listUrl = base + (created.headers.get("location") ?? "");
    await fetch(`${listUrl}/share`, { method: "POST", redirect: "manual" });
    const listPage = await (await fetch(listUrl)).text();
    const token = /\/shared\/(\w+)/.exec(listPage)?.[1];
    assert.ok(token);
    const shared = await (await fetch(`${base}/shared/${token}`)).text();
    assert.match(shared, /Shared reading/);
    assert.equal(shared.includes("<form"), false);
    assert.equal(shared.includes("/lists/"), false);
    assert.equal(shared.includes("/items/"), false);
  });
});

test("web: shared view reflects new items", async () => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/lists`, {
      method: "POST",
      body: new URLSearchParams({ title: "Live list" }),
      redirect: "manual",
    });
    const listUrl = base + (created.headers.get("location") ?? "");
    await fetch(`${listUrl}/items`, {
      method: "POST",
      body: new URLSearchParams({
        title: "First article",
        url: "https://first.example",
      }),
      redirect: "manual",
    });
    await fetch(`${listUrl}/share`, { method: "POST", redirect: "manual" });
    const listPage = await (await fetch(listUrl)).text();
    const token = /\/shared\/(\w+)/.exec(listPage)?.[1];
    assert.ok(token);
    const before = await (await fetch(`${base}/shared/${token}`)).text();
    assert.match(before, /First article/);
    await fetch(`${listUrl}/items`, {
      method: "POST",
      body: new URLSearchParams({
        title: "Second article",
        url: "https://second.example",
      }),
      redirect: "manual",
    });
    const after = await (await fetch(`${base}/shared/${token}`)).text();
    assert.match(after, /Second article/);
  });
});

test("web: unknown share token returns the same 404 as an unknown route", async () => {
  await withServer(async (base) => {
    const shared = await fetch(`${base}/shared/not-a-real-token`);
    const unknown = await fetch(`${base}/this-route-does-not-exist`);
    assert.equal(shared.status, 404);
    assert.equal(unknown.status, 404);
    assert.equal(await shared.text(), await unknown.text());
  });
});

test("web: sharing again returns the same token", async () => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/lists`, {
      method: "POST",
      body: new URLSearchParams({ title: "Once" }),
      redirect: "manual",
    });
    const listUrl = base + (created.headers.get("location") ?? "");
    await fetch(`${listUrl}/share`, { method: "POST", redirect: "manual" });
    const first = await (await fetch(listUrl)).text();
    const token1 = /\/shared\/(\w+)/.exec(first)?.[1];
    assert.ok(token1);
    await fetch(`${listUrl}/share`, { method: "POST", redirect: "manual" });
    const second = await (await fetch(listUrl)).text();
    const token2 = /\/shared\/(\w+)/.exec(second)?.[1];
    assert.equal(token2, token1);
  });
});

import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";

type Bindings = {
  JUDGE_IP_BEG: string;
  D1: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/check", (c) => {
  const JUDGE_IP_BEG = c.env.JUDGE_IP_BEG;
  const info = getConnInfo(c);
  const address = info.remote.address;
  if (!address) return c.text("No address", 500);
  return c.json({ judge: address.startsWith(JUDGE_IP_BEG) });
});

app.get("/test", async (c) => {
  /*
  const ret = await c.env.D1.prepare(
    "CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, active BOOLEAN, logged_at TEXT NOT NULL)",
  )
    .bind()
    .run();
  console.log(ret.results);
  */
  const ret = await c.env.D1.prepare(
    "select name from sqlite_master where type='table'",
  )
    .bind()
    .run();
  return c.json(ret.results);
});

export default app;

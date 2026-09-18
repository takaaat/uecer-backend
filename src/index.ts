import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";

type Bindings = {
  JUDGE_IP_BEG: string;
  DB: D1Database;
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

export default app;

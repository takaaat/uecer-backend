import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/check", (c) => {
  const info = getConnInfo(c);
  const address = info.remote.address;
  if (!address) return c.text("No address", 500);
  return c.json({ judge: address.startsWith("130.153.") });
});

export default app;

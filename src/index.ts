import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";
import { mainService } from "./service";
import { logsRepository } from "./repository";

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

app.get("/judge", async (c) => {
  const logsRepo = logsRepository(c.env.D1);
  const service = mainService(logsRepo);
  await service.record(true);
  return c.text("done");
});

app.get("/logs", async (c) => {
  const logsRepo = logsRepository(c.env.D1);
  const service = mainService(logsRepo);
  const logs = await service.logs();
  return c.json(logs);
});

app.get("/latest", async (c) => {
  const logsRepo = logsRepository(c.env.D1);
  const service = mainService(logsRepo);
  const latestLog = await service.latest();
  return c.json(latestLog);
});

export default app;

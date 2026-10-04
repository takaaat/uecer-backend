import { Hono } from "hono";
import type { Context } from "hono";
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

const judge = (c: Context) => {
  const JUDGE_IP_BEG = c.env.JUDGE_IP_BEG;
  const info = getConnInfo(c);
  const address = info.remote.address;
  if (!address) {
    return false;
  }
  return address.startsWith(JUDGE_IP_BEG);
};

app.get("/check", (c) => {
  return c.json({ judge: judge(c) });
});

app.get("/judge", async (c) => {
  const logsRepo = logsRepository(c.env.D1);
  const service = mainService(logsRepo);
  await service.record(judge(c));
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

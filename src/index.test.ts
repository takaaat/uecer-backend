import { describe, expect, test, vi } from "vitest";
import app from ".";
import { getConnInfo } from "hono/cloudflare-workers";
import { ConnInfo } from "hono/conninfo";

vi.mock("hono/cloudflare-workers");

describe("Example", () => {
  test("GET /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello Hono!");
  });

  test("内部IPを判別する", async () => {
    const trueConnInfo: ConnInfo = {
      remote: {
        address: "130.153.1.1",
      },
    };
    vi.mocked(getConnInfo).mockReturnValue(trueConnInfo);
    const res = await app.request("/check");
    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({ judge: true });
  });

  test("外部IPを判別する", async () => {
    const falseConnInfo: ConnInfo = {
      remote: {
        address: "192.168.1.1",
      },
    };
    vi.mocked(getConnInfo).mockReturnValue(falseConnInfo);
    const res = await app.request("/check");
    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({ judge: false });
  });
});

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mainService } from "./service";
import { Log, logsRepository, statusRepository } from "./repository";

function createTestFixture() {
  const statusRepo = statusRepository();
  const logsRepo = logsRepository();
  const service = mainService(statusRepo, logsRepo);
  return {
    service,
  };
}

describe("記録する", () => {
  let fixture: ReturnType<typeof createTestFixture>;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = createTestFixture();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("記録がstatusに反映される", () => {
    expect(fixture.service.status()).toBe(false);
    fixture.service.record(true);
    expect(fixture.service.status()).toBe(true);
  });
  test("記録がactiveからinactiveになったときlogに追加される", () => {
    const begindt = new Date(2026, 4, 1, 6, 0, 0, 0);
    vi.setSystemTime(begindt);
    fixture.service.record(true);
    const enddt = new Date(2026, 4, 1, 7, 0, 0, 0);
    vi.setSystemTime(enddt);
    fixture.service.record(false);
    const expectedLogs: Log[] = [{ started_at: begindt, ended_at: enddt }];
    expect(fixture.service.logs()).toStrictEqual(expectedLogs);
  });
});

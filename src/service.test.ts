import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mainService } from "./service";
import { Log, logsRepository } from "./repository";

function createTestFixture() {
  const logsRepo = logsRepository();
  const service = mainService(logsRepo);
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
    const begindt = new Date(2026, 4, 1, 6, 0, 0, 0);
    vi.setSystemTime(begindt);
    fixture.service.record(true);
    const enddt = new Date(2026, 4, 1, 7, 0, 0, 0);
    vi.setSystemTime(enddt);
    fixture.service.record(false);
    const expectedLogs: Log[] = [
      { logged_at: begindt, is_active: true },
      { logged_at: enddt, is_active: false },
    ];
    expect(fixture.service.logs()).toStrictEqual(expectedLogs);
    expect(fixture.service.latest()).toStrictEqual(expectedLogs[-1]);
  });
});

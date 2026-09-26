export interface Log {
  id: number;
  active: boolean;
  logged_at: string;
}

export interface LogsRepository {
  create: (isActive: boolean) => Promise<Log[]>;
  getLogs: () => Promise<Log[]>;
  getLatestLog: () => Promise<Log | null>;
}

export const logsRepository = (D1: D1Database): LogsRepository => {
  return {
    create: async (isActive: boolean) => {
      const result = await D1.prepare("INSERT INTO logs (active) VALUES (?);")
        .bind(isActive)
        .run<Log>();
      return result.results;
    },
    getLogs: async () => {
      const result = await D1.prepare("SELECT * FROM logs;").run<Log>();
      return result.results;
    },
    getLatestLog: async () => {
      const result = await D1.prepare(
        "SELECT * FROM logs ORDER BY logged_at DESC LIMIT 1;",
      ).run<Log>();
      if (!result.error && result.results) {
        return result.results[0];
      }
      return null;
    },
  };
};

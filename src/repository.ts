export interface Log {
  is_active: boolean;
  logged_at: Date;
}

export interface LogsRepository {
  create: (newLog: Log) => void;
  getLogs: () => Log[];
  getLatestLog: () => Log | null;
}

export const logsRepository = (D1: D1Database): LogsRepository => {
  const logs: Log[] = [];
  return {
    create: async (newLog: Log) => {
      const result = await D1.prepare("INSERT INTO logs (active) VALUES (?);")
        .bind(newLog.is_active)
        .run();
      console.log(result.error);
      logs.push(newLog);
    },
    getLogs: () => {
      return logs;
    },
    getLatestLog: () => {
      return logs[-1];
    },
  };
};

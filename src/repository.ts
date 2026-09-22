export interface Log {
  is_active: boolean;
  logged_at: Date;
}

export interface LogsRepository {
  create: (newLog: Log) => void;
  getLogs: () => Log[];
  getLatestLog: () => Log | null;
}

export const logsRepository = (): LogsRepository => {
  const logs: Log[] = [];
  return {
    create: (newLog: Log) => {
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

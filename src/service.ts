import type { Log, LogsRepository } from "./repository";

export interface AnalyticsDay {
  date: string;
  logs: number;
}

export interface MainServiceType {
  record: (isActive: boolean) => Promise<void>;
  logs: () => Promise<Log[]>;
  latest: () => Promise<Log | null>;
  analytics: (
    beginDateTime: Date,
    endDateTime: Date,
  ) => Promise<AnalyticsDay[]>;
}

const convertDateToString = (dt: Date): string => {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export const mainService = (
  logsRepository: LogsRepository,
): MainServiceType => {
  return {
    record: async (isActive: boolean) => {
      await logsRepository.create(isActive);
    },
    logs: async () => {
      return logsRepository.getLogs();
    },
    latest: async () => {
      return logsRepository.getLatestLog();
    },
    analytics: async (beginDateTime, endDateTime) => {
      const beginDate = new Date(
        beginDateTime.getFullYear(),
        beginDateTime.getMonth(),
        beginDateTime.getDate(),
      );
      const endDate = new Date(
        endDateTime.getFullYear(),
        endDateTime.getMonth(),
        endDateTime.getDate() + 1,
      );

      const daysRange = Math.floor(
        (endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysRange > 1024) return [];

      const hourTable: AnalyticsDay[] = [];
      const current = new Date(beginDate.getTime());
      while (current.getTime() - endDate.getTime() < 0) {
        hourTable.push({
          date: convertDateToString(current),
          logs: 0,
        });
        current.setDate(current.getDate() + 1);
      }

      const logs = await logsRepository.getLogs();
      logs.forEach((log) => {
        if (!log.active) return;
        const logged_at = new Date(log.logged_at.replace(" ", "T"));
        const diffFromBegin = logged_at.getTime() - beginDate.getTime();
        const diffToEnd = endDate.getTime() - logged_at.getTime();
        if (diffFromBegin < 0 || diffToEnd <= 0) return;
        const idx = Math.floor(diffFromBegin / (1000 * 60 * 60 * 24));
        hourTable[idx].logs =
          hourTable[idx].logs | ((1 << 23) >>> logged_at.getHours());
      });
      return hourTable;
    },
  };
};

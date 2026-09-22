import type { Log, LogsRepository } from "./repository";

export interface MainServiceType {
  record: (isActive: boolean) => void;
  logs: () => Log[];
  latest: () => Log | null;
}

export const mainService = (
  logsRepository: LogsRepository,
): MainServiceType => {
  return {
    record: (isActive: boolean) => {
      const now = new Date();
      logsRepository.create({
        is_active: isActive,
        logged_at: now,
      });
    },
    logs: () => {
      return logsRepository.getLogs();
    },
    latest: () => {
      return logsRepository.getLatestLog();
    },
  };
};

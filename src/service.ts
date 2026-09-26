import type { Log, LogsRepository } from "./repository";

export interface MainServiceType {
  record: (isActive: boolean) => void;
  logs: () => Promise<Log[]>;
  latest: () => Promise<Log | null>;
}

export const mainService = (
  logsRepository: LogsRepository,
): MainServiceType => {
  return {
    record: (isActive: boolean) => {
      logsRepository.create(isActive);
    },
    logs: async () => {
      return logsRepository.getLogs();
    },
    latest: async () => {
      return logsRepository.getLatestLog();
    },
  };
};

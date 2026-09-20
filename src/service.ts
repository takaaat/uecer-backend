import type { Log, LogsRepository, StatusRepository } from "./repository";

export interface MainServiceType {
  status: () => boolean;
  record: (isActive: boolean) => void;
  logs: () => Log[];
}

export const mainService = (
  statusRepository: StatusRepository,
  logsRepository: LogsRepository,
): MainServiceType => {
  return {
    status: () => {
      return statusRepository.getStatus().last_status;
    },
    record: (isActive: boolean) => {
      const now = new Date();
      const recent_status = statusRepository.getStatus();
      if (isActive === false && recent_status.last_status === true) {
        logsRepository.create({
          started_at: recent_status.last_status_changed_at!,
          ended_at: now,
        });
      }
      statusRepository.update({
        last_judged_at: now,
        last_status: isActive,
        last_status_changed_at: now, // TODO: FIXME
      });
    },
    logs: () => {
      return logsRepository.getLogs();
    },
  };
};

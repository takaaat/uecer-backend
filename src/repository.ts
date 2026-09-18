export interface Log {
  started_at: Date;
  ended_at?: Date;
}

export interface Status {
  last_judged_at?: Date;
  last_status: boolean;
  last_status_changed_at?: Date;
}

export interface StatusRepository {
  update: (newStatus: Status) => void;
  getStatus: () => Status;
}

export interface LogsRepository {
  create: (newLog: Log) => void;
  getLogs: () => Log[];
}

export const statusRepository = (): StatusRepository => {
  let status: Status = { last_status: false };
  return {
    update: (newStatus: Status) => {
      status = { ...newStatus };
    },
    getStatus: () => {
      return { ...status };
    },
  };
};

export const logsRepository = (): LogsRepository => {
  const logs: Log[] = [];
  return {
    create: (newLog: Log) => {
      logs.push(newLog);
    },
    getLogs: () => {
      return logs;
    },
  };
};

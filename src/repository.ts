export interface Log {
  started_at: Date;
  ended_at?: Date;
}

export interface Status {
  last_judged_at?: Date;
  last_status: boolean;
  last_status_changed_at?: Date;
}

export const statusRepository = () => {
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

export const logsRepository = () => {
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

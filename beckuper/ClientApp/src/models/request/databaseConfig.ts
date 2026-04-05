import type { DatabaseType } from "../enums/databaseesTypes";

export type DatabaseConfigRequest = {
  name: string;
  type: DatabaseType;

  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;

  retentionDays?: string;
  cronSchedule?: string;
}
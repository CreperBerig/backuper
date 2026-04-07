import type { DatabaseType } from "../enums/databaseesTypes";

export type DatabaseConfigResponse = {
  id: number;
  name: string;
  type: DatabaseType;

  host: string;
  port: number;
  username: string;
  databaseName: string;

  retentionDays: string;
  cronSchedule: string;
}

export type DatabaseConfigMinimalResponse = {
  id: number;
  name: string;
}
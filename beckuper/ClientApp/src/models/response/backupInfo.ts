import type { BackupStatus } from "../enums/backupStatus";
import type { BackupTrigger } from "../enums/backupTrigger";

export type BackupInfo = {
  id: number;
  databaseConfigId: number;

  createdAt: Date;
  sizeBytes: number;
  status: BackupStatus;
  filePath: string;
  trigger: BackupTrigger;
  errorMessage?: string;
}
export const BackupStatus = {
  InProgress: 0,
  Success: 1,
  Failed: 2
} as const;

export type BackupStatus = typeof BackupStatus[keyof typeof BackupStatus];
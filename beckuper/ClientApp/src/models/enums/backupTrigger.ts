export const BackupTrigger = {
  Scheduled: 0,
  Manual: 1,
} as const;

export type BackupTrigger = typeof BackupTrigger[keyof typeof BackupTrigger];
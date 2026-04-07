import type { BackupInfo } from "../../models/response/backupInfo"

interface Props {
  backup: BackupInfo,
  onClick: (backup: BackupInfo) => void;
}

export function BackupsTile({backup, onClick}: Props) {

  const backupStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <p className="text-sm text-text-description outline-1 outline-outline rounded w-fit px-1 mx-auto bg-bg-disabled/20">In progress</p>
        );
      case 1:
        return (
          <p className="text-sm text-accent outline-1 outline-accent rounded w-fit px-1 mx-auto bg-accent/10">Susses</p>
        );
      case 2:
        return (
          <p className="text-sm text-error outline-1 outline-error rounded w-fit px-1 mx-auto bg-error/10">Failed</p>
        );
      default:
        return (
          <p className="text-sm text-warn outline-1 outline-warn rounded w-fit px-1 mx-auto bg-warn/20">Unknown</p>
        );
    }
  }

  const backupTrigger = (trigger: number) => {
    switch (trigger) {
      case 0:
        return (
          <p className="text-sm text-text-description outline-1 outline-outline rounded w-fit px-1 bg-bg-disabled/20">Scheduled</p>
        );
      case 1:
        return (
          <p className="text-sm text-accent outline-1 outline-accent rounded w-fit px-1 bg-accent/10">Manual</p>
        );
      default:
        return (
          <p className="text-sm text-warn outline-1 outline-warn rounded w-fit px-1 bg-warn/20">Unknown</p>
        );
    }
  }

  return (
    <div className="rounded hover:bg-bg-secondary grid grid-cols-4 py-1 px-3 cursor-pointer" onClick={() => onClick(backup)}>
      <p>{new Date(backup.createdAt).toLocaleString()}</p>
      <div className="flex items-center justify-center">
        {backupStatus(backup.status)}
      </div>
      <div className="flex items-center justify-center">
        {backupTrigger(backup.trigger)}
      </div>
      <p className="text-end text-text-description">{backup.sizeBytes} bytes</p>
    </div>
  )
}

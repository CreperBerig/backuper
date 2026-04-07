import { Clock2Icon, InfoIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import type { BackupInfo } from "../../models/response/backupInfo"
import { useState } from "react";
import { fetchBackups } from "../../api/backupApi";

interface Props {
  backup: BackupInfo | undefined;
  onClose: () => void;
  updateBackupList: () => void;
}

export function BackupInfoModal({onClose, backup, updateBackupList}: Props) {
  const [awaiting, setAwaiting] = useState<boolean>(false);

  const deleteBackup = async () => {
    try {
      if(backup) {
        setAwaiting(true);
        const response = await fetchBackups.delete(backup?.id);
        if(response) {
          updateBackupList();
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAwaiting(false);
    }
  }

  const backupStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <p className="text-sm text-text-description outline-1 outline-outline rounded w-fit px-1 bg-bg-disabled/20">In progress</p>
        );
      case 1:
        return (
          <p className="text-sm text-accent outline-1 outline-accent rounded w-fit px-1 bg-accent/10">Susses</p>
        );
      case 2:
        return (
          <p className="text-sm text-error outline-1 outline-error rounded w-fit px-1 bg-error/10">Failed</p>
        );
      default:
        return (
          <p className="text-sm text-warn outline-1 outline-warn rounded w-fit px-1 bg-warn/20">Unknown</p>
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
    <div className="bg-bg-primary border border-outline p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Backup info</p>
        <button onClick={onClose}><XIcon size={16} /></button>
      </div>
      {
        backup ? (
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock2Icon size={20}/>
                <p className="text-lg font-medium">{new Date(backup.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                { backupStatus(backup.status) }
                { backupTrigger(backup.trigger) }
              </div>
            </div>
            {
              backup.status === 0 ? (
                <div className="flex items-center justify-center h-24">
                  <LoaderCircleIcon className="animate-spin stroke-accent" />
                </div>
              ) : backup.status === 1 ? (
                <div>
                  <p>Size: {backup.sizeBytes} bytes</p>
                  <p>Path: "{backup.filePath}"</p>
                </div>
              ) : backup.status === 2 ? (
                <div className="px-2 py-1 rounded-lg outline outline-error bg-error/10 text-error stroke-error">
                  <div className="flex gap-2 items-center">
                    <InfoIcon size={20}/>
                    <p className="text-lg font-medium">Error:</p>
                  </div>
                  <p className="text-wrap">{backup.errorMessage}</p>
                </div>
              ) : (
                <div>
                  Unknown
                </div>
              )
            }
          </section>
        ) : (
          <section className="h-20 flex items-center justify-center">
            <p>Load</p>
          </section>
        )
      }
      <div className="w-full flex gap-2 justify-center mt-2">
        <button className="btn cancel" disabled={awaiting} onClick={deleteBackup}>Delete</button>
        {
          backup?.status === 1 ? (
            <>
              <button className="btn accent" disabled={awaiting} onClick={() => fetchBackups.downloadBackup(backup.id)}>Download</button>
              <button className="btn" disabled={awaiting}>Load</button>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

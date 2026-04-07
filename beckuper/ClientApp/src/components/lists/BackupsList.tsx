import { LoaderCircleIcon, RotateCcwIcon } from "lucide-react";
import type { BackupInfo } from "../../models/response/backupInfo"
import { BackupsTile } from "../tiles/BackupsTile";
import { BackupInfoModal } from "../modals/BackupInfoModal";
import { useState } from "react";

interface Props {
  backups: BackupInfo[] | undefined;
  updateBackups: () => void;
  isButtonDisabled: boolean;
}

export function BackupsList({backups, updateBackups, isButtonDisabled}: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBackup, setCurrentBackup] = useState<BackupInfo>();

  const switchModal = () => setModalOpen(!isModalOpen)

  const onClick = (backup: BackupInfo) => {
    setCurrentBackup(backup);
    switchModal();
  }

  return (
    <div className="rounded-xl outline outline-outline min-h-full container mx-auto">
      <div className="flex justify-between items-center border-b border-outline p-2">
        <p>{backups ? `backups: ${backups.length}` : "backups: 0"}</p>
        <button onClick={updateBackups} disabled={isButtonDisabled}><RotateCcwIcon /></button>
      </div>
      {
        !backups ? (
          <div className="min-h-full flex items-center justify-center">
            <LoaderCircleIcon className="animate-spin" />
          </div>
        ) : backups.length === 0 ? (
          <div className="min-h-full flex items-center justify-center">
            <p>No backups</p>
          </div>
        ) : (
          <div className="min-h-full p-1 space-y-1">
            {
              backups.map((backup) => <BackupsTile backup={backup} key={backup.id} onClick={onClick}/>)
            }
          </div>
        )
      }
      {
        isModalOpen ?
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <BackupInfoModal onClose={switchModal} updateBackupList={updateBackups} backup={currentBackup}/>
          </div>
        ) : null
      }
    </div>
  )
}

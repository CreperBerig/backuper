import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { DatabaseConfigResponse } from "../../models/response/databaseConfig";
import { fetchDatabaseConfig } from "../../api/databaseApi";
import { useNavigate, useParams } from "react-router";
import { DatabaseTypeLabels } from "../../constants/databases";
import { Clock2Icon } from "lucide-react";
import { AddDatabaseConfigModal } from "../../components/modals/AddDatabaseConfigModal";
import { fetchBackups } from "../../api/backupApi";
import type { BackupInfo } from "../../models/response/backupInfo";
import { BackupsList } from "../../components/lists/BackupsList";

export function DashboardPage() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isAwaitButtons, setAwaitButtons] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError>();
  const [data, setData] = useState<DatabaseConfigResponse>();
  const [backups, setBackups] = useState<BackupInfo[]>();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate  = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    loadDatabaseConfig()
  }, [id])

  useEffect(() => {
    document.title = `Backuper | ${data?.name !== undefined ? data.name : ""} Dashboard`;
    console.log(data);
  }, [data])

  const loadDatabaseConfig = async () => {
    console.log("is number:", id && Number.isNaN(Number.parseInt(id)))
    if(id && !Number.isNaN(Number.parseInt(id))) {
      try {
        const response = await fetchDatabaseConfig.getById(Number.parseInt(id));
        setData(response);
        loadBackups();
      } catch (error) {
        console.log(error)
        setError((error as AxiosError));
      } finally {
        setLoading(false);
      }
    }
  }

  const loadBackups = async () => {
    if(id && !Number.isNaN(Number.parseInt(id))) {
      try {
        setAwaitButtons(true);
        const response = await fetchBackups.getByDatabaseConfigId(Number.parseInt(id));
        setBackups(response);
      } catch (error) {
        console.log(error)
        setError((error as AxiosError));
      } finally {
        setAwaitButtons(false);
      }
    }
  }

  const switchModal = () => setModalOpen(!isModalOpen)

  const handleDeleteDatabase = async () => {
    try {
      setAwaitButtons(true);
      if(id) {
        const response = await fetchDatabaseConfig.delete(Number.parseInt(id));
        if(response) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error)
      setError((error as AxiosError));
    } finally {
      setAwaitButtons(false);
    }
  }

  const handleCreateBackup = async () => {
    try {
      setAwaitButtons(true);
      if(id) {
        const response = await fetchBackups.createManual(Number.parseInt(id));
        if(response) {
          loadBackups();
        }
      }
    } catch (error) {
      console.log(error)
      setError((error as AxiosError));
    } finally {
      setAwaitButtons(false);
    }
  }

  if(isLoading || data === undefined)
    return <div>Loading...</div>

  if(error)
    return <div>Error {error.message}</div>

  return (
    <div className="space-y-4">
      <div className="rounded-xl outline-outline outline p-2 container mx-auto space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">{data.name}</p>
          <div className="flex gap-2">
            <button className="btn accent" onClick={switchModal} disabled={isAwaitButtons}>Edit</button>
            <button className="btn cancel" onClick={handleDeleteDatabase} disabled={isAwaitButtons}>Delete</button>
            <button className="btn" onClick={handleCreateBackup} disabled={isAwaitButtons}>Backup</button>
          </div>
        </div>
        <hr className="border-outline" />
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-text-description">{DatabaseTypeLabels[data.type]}</p>
            <p className="text-base">{data.host}:{data.port}</p>
            <p className="text-text-description rounded outline outline-outline flex items-center px-2 py-0.5">{data.username}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Clock2Icon size={20}/>
            <p>last backup: {backups && backups.length > 0 ? new Date(backups[0].createdAt).toLocaleString() : "never"}</p>
          </div>
        </div>
      </div>
      <BackupsList backups={backups} updateBackups={loadBackups} isButtonDisabled={isAwaitButtons}/>
      {
        isModalOpen ?
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <AddDatabaseConfigModal onClose={switchModal} updateDatabaseList={loadDatabaseConfig} updating data={data}/>
          </div>
        ) : null
      }
    </div>
  )
}

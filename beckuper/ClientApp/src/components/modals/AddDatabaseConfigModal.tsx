import { XIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { fetchDatabaseConfig } from "../../api/databaseApi";
import type { AxiosError } from "axios";

interface Props {
  onClose: () => void;
  updateDatabaseList: () => void;
}

export function AddDatabaseConfigModal({onClose}: Props) {
  const [host, setHost] = useState<string>("");
  const [port, setPort] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [databaseName, setDatabaseName] = useState<string>("");

  const [isSucConnest, setIsSucConnect] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFulled, setIsFulled] = useState<boolean>(false);

  useEffect(() => {
    if(host && port && username && password && databaseName) {
      setIsFulled(true);
    } else {
      setIsFulled(false);
    }
  }, [host, port, username, password, databaseName])

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const isExisting = await fetchDatabaseConfig.testConnectionByConfig({
        host,
        port,
        username,
        password,
        databaseName
      });
      if(isExisting) {
        setIsSucConnect(true);
        setError(null);
      }
    } catch (error) {
      setIsSucConnect(false);
      setError((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddConfig = async () => {
    setLoading(true);
    try {
      // const isExisting = await fetchDatabaseConfig.create({
      //   host,
      //   port,
      //   username,
      //   password,
      //   databaseName
      // });
      // if(isExisting) {
      //   setIsSucConnect(true);
      //   setError(null);
      // }
    } catch (error) {
      setIsSucConnect(false);
      setError((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-primary border border-outline p-6 rounded-xl shadow-xl w-full max-w-md space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Add database</p>
        <button onClick={onClose}><XIcon size={16} /></button>
      </div>
      <div className="w-full flex gap-2">
        <input 
          placeholder="host"
          type="text"
          className="px-2 py-1 rounded bg-bg-secondary outline outline-outline flex-1"
        />
        <input 
          placeholder="port"
          type="number"
          min={1}
          max={65535}
          className="px-2 py-1 rounded bg-bg-secondary outline outline-outline"
        />
      </div>
      <input 
        placeholder="username"
        type="text"
        className="px-2 py-1 w-full rounded bg-bg-secondary outline outline-outline"
      />
      <input 
        placeholder="password"
        type="password"
        className="px-2 py-1 w-full rounded bg-bg-secondary outline outline-outline"
      />
      <input 
        placeholder="database name"
        type="text"
        className="px-2 py-1 w-full rounded bg-bg-secondary outline outline-outline"
      />
      <div className="w-full flex gap-2 justify-between mt-2">
        <button onClick={handleTestConnection} className="btn accent" disabled={!isFulled || isLoading}>test</button>
        <button onClick={handleTestConnection} className="btn accent" disabled={!isFulled || isLoading}>add</button>
      </div>
    </div>
  )
}

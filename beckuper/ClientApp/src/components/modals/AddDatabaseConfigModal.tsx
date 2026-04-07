import { CheckCircleIcon, XCircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDatabaseConfig } from "../../api/databaseApi";
import type { AxiosError } from "axios";
import { DatabaseType } from "../../models/enums/databaseesTypes";
import type { DatabaseConfigResponse } from "../../models/response/databaseConfig";

interface Props {
  onClose: () => void;
  updateDatabaseList: () => void;
  updating?: boolean;
  data?: DatabaseConfigResponse;
}

export function AddDatabaseConfigModal({onClose, updateDatabaseList, updating = false, data}: Props) {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<DatabaseType>();

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
    if(host && port && username && password && databaseName && name && type !== undefined) {
      setIsFulled(true);
      console.log(isFulled);
      console.log({
        name,
        type,
        host,
        port,
        username,
        password,
        databaseName
      });
    } else {
      setIsFulled(false);
    }
  }, [host, port, username, password, databaseName, name, type])

  useEffect(() => {
    if(data) {
      setName(data.name);
      setType(data.type);
      setHost(data.host);
      setPort(data.port);
      setUsername(data.username);
      setDatabaseName(data.databaseName);
    }
  }, [data])

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const isExisting = await fetchDatabaseConfig.testConnectionByConfig({
        type,
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
      if(type !== undefined) {
        let isExisting
        if(updating) {
          
        } else {
          isExisting = await fetchDatabaseConfig.create({
            name,
            type,
            host,
            port,
            username,
            password,
            databaseName
          });
        }
        if(isExisting) {
          setIsSucConnect(true);
          setError(null);
          updateDatabaseList();
          onClose();
        }
      }
    } catch (error) {
      setIsSucConnect(false);
      setError((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg-primary border border-outline p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Add database</p>
        <button onClick={onClose}><XIcon size={16} /></button>
      </div>
      <section className="space-y-2">
        <p className="font-medium">Information</p>
        <div className="w-full flex gap-2">
          <input 
            placeholder="name"
            type="text"
            className="w-2/3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="w-1/3"
            value={type}
            onChange={(e) => {
              const val = e.target.value;
              setType(val === "" ? undefined : Number(val) as DatabaseType);
            }}
          >
            <option className="text-text-description" value="">Select database type</option>
            {Object.entries(DatabaseType).map(([key, value]) => (
              <option key={key} value={value}>{key}</option>
            ))}
          </select>
        </div>
      </section>
      <section className="space-y-2">
        <p className="font-medium">Connection</p>
        <div className="w-full flex gap-2">
          <input 
            placeholder="host"
            type="text"
            className="w-full"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <input 
            placeholder="port"
            type="number"
            min={1}
            max={65535}
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />
        </div>
        <input 
          placeholder="username"
          type="text"
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          placeholder="password"
          type="password"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          placeholder="database name"
          type="text"
          className="w-full"
          value={databaseName}
          onChange={(e) => setDatabaseName(e.target.value)}
        />
      </section>
      <section className="space-y-2">
        <p className="font-medium">Backup Config</p>
        <div className="w-full flex gap-2">
          <input 
            placeholder="retention days"
            type="number"
            min={1}
            max={65535}
            className="w-1/2"
          />
          <input 
            placeholder="cron schedule"
            type="text"
            className="w-1/2"
          />
        </div>
      </section>
      {
        isSucConnest ? (
          <div className="rounded bg-success/20 text-success outline-success outline-1 flex gap-2 items-center p-2">
            <CheckCircleIcon className="stroke-success" /> Connection successful
          </div>
        ) : null
      }
      {
        error ? (
          <div className="rounded bg-error/20 text-error outline-error outline-1 flex gap-2 items-center p-2">
            <XCircleIcon className="stroke-error" /> Connection successful
          </div>
        ) : null
      }
      <div className="w-full flex gap-2 justify-between mt-2">
        <button onClick={handleTestConnection} className="btn accent" disabled={!isFulled || isLoading}>test</button>
        <button onClick={handleAddConfig} className="btn accent" disabled={!isFulled || isLoading}>add</button>
      </div>
    </div>
  )
}

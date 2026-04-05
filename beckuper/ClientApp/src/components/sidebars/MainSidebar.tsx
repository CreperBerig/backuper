import { HomeIcon, LoaderCircleIcon, PlusCircleIcon, SettingsIcon } from "lucide-react";
import { ROUTES } from "../../constants/routing";
import { NavSidebarTile } from "../tiles/NavSidebarTile";
import { useEffect, useState } from "react";
import { type DatabaseConfigResponse } from "../../models/response/databaseConfig";
import { fetchDatabaseConfig } from "../../api/databaseApi";
import { AxiosError } from "axios";
import { AddDatabaseConfigModal } from "../modals/AddDatabaseConfigModal";

export function MainSidebar() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [databases, setDatabases] = useState<DatabaseConfigResponse[]>([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await fetchDatabaseConfig.getAll();
      setDatabases(data);
      console.log(data);
    } catch (error) {
      console.error((error as AxiosError).toJSON);
      setError((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  }

  const switchModal = () => setModalOpen(!isModalOpen)

  return (
    <div className="p-4 border-r border-outline max-h-screen w-60 flex flex-col gap-2">
      <div className="space-y-1">
        <p className="text-lg font-semibold">Main</p>
        <div>
          <NavSidebarTile to={ROUTES.home} title="Home" icon={<HomeIcon />} />
        </div>
      </div>
      <hr className="border-outline"/>
      <div className="space-y-1 overflow-y-auto flex-1">
        <p className="text-lg font-semibold">Databases</p>
        {
          isLoading ? (
            <div className="flex items-center justify-center h-50">
              <LoaderCircleIcon className="animate-spin stroke-accent" size={32}/>
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : databases.length > 0 ? (
            databases.map((database) => (
              <div>
                <NavSidebarTile to={ROUTES.dashboard(1)} title={database.name} key={database.id} />
              </div>
            )) 
          ) : (
            <div className="text-text-description">No databases found</div>
          )
        }
      </div>

      <div>
        <button onClick={switchModal} className="rounded-lg flex gap-4 px-3 py-1.5 font-medium bg-bg-primary hover:bg-bg-secondary text-text-primary stroke-text-primary">
          <PlusCircleIcon />
          Add database
        </button>
        <NavSidebarTile to={ROUTES.settings.index} title="Settings" icon={<SettingsIcon />}/>
      </div>

      {
        isModalOpen ?
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <AddDatabaseConfigModal onClose={switchModal} updateDatabaseList={fetchData}/>
          </div>
        ) : null
      }
    </div>
  )
}

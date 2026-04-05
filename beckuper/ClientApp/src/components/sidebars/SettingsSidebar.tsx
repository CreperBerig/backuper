import { DatabaseBackupIcon, PaintbrushIcon } from "lucide-react";
import { ROUTES } from "../../constants/routing";
import { NavSidebarTile } from "../tiles/NavSidebarTile";

interface Props {
  className: string;
}

export function SettingsSidebar({className}: Props) {
  return (
    <aside className={`p-4 border-r border-outline flex flex-col gap-2 ${className}`}>
      <NavSidebarTile title="Application" to={ROUTES.settings.index} icon={<DatabaseBackupIcon /> } />
      <NavSidebarTile title="Local" to={ROUTES.settings.local} icon={<PaintbrushIcon /> } />
    </aside>
  )
}

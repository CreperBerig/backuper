import { Link } from "react-router";
import { ROUTES } from "../../constants/routing";
import { ArrowLeftIcon } from "lucide-react";

interface Props {
  className: string;
}


export function SettingsHeader({className}: Props) {
  return (
    <header className={`p-4 border-b border-outline ${className}`}>
      <Link to={ROUTES.home} className="flex gap-2 items-center hover:bg-bg-secondary w-fit py-1.5 px-3 rounded-lg">
        <ArrowLeftIcon size={16}/>
        Home
      </Link>
    </header>
  )
}

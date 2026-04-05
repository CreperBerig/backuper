import { NavLink } from "react-router";

interface Props {
  icon?: React.ReactNode;
  title: string;
  to: string;
}

export function NavSidebarTile({to, icon, title}: Props) {
  return (
    <NavLink 
      to={to} end 
      className={({ isActive }) => isActive ?  
        "rounded-lg flex gap-4 px-3 py-1.5 font-medium bg-accent text-text-on-accent stroke-text-on-accent" :
        "rounded-lg flex gap-4 px-3 py-1.5 font-medium bg-bg-primary hover:bg-bg-secondary text-text-primary stroke-text-primary" 
      }
    >
      {icon ? icon : null}
      <p>{title}</p>
    </NavLink>
  )
}

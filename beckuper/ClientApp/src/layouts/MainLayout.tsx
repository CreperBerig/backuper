import { Outlet } from "react-router";
import { MainSidebar } from "../components/sidebars/MainSidebar";
import { HomeHeader } from "../components/headers/HomeHeader";

export function MainLayout() {
  return (
    <div className="grid h-screen grid-cols-[250px_1fr] grid-rows-[auto_1fr]">
      <HomeHeader className="col-span-2"/>
      <MainSidebar />
      <main className="overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

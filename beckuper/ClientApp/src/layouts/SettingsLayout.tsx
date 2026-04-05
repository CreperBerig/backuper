import { Outlet } from "react-router";
import { SettingsHeader } from "../components/headers/SettingsHeader";
import { SettingsSidebar } from "../components/sidebars/SettingsSidebar";
import { SettingsFooterProvider, useSettingsFooter } from "../contexts/SettingsFooterContext";

function SettingsFooter() {
  const { changesCount, isDisabled, onSubmit, onCancel } = useSettingsFooter();
  return (
    <div className="flex p-4 border-t border-outline col-start-2 justify-between">
      <p>Changes count: {changesCount}</p>
      <div className="flex gap-2">
        <button className="btn accent" disabled={isDisabled} onClick={onSubmit}>Submit</button>
        <button className="btn cancel" disabled={isDisabled} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export function SettingsLayout() {
  return (
    <SettingsFooterProvider>
      <div className="grid h-screen grid-cols-[250px_1fr] grid-rows-[auto_1fr_auto]">
        <SettingsHeader className="col-span-2"/>
        <SettingsSidebar className="row-span-2"/>
        <main className="overflow-y-auto p-4">
          <Outlet />
        </main>
        <SettingsFooter />
      </div>
    </SettingsFooterProvider>
  );
}

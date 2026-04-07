export function SettingsSuspenseView() {
  return (
    <div className="space-y-2">
      <SettingsSuspenseTile />
      <SettingsSuspenseTile />
      <SettingsSuspenseTile />
    </div>
  )
}

function SettingsSuspenseTile() {
  return (
    <section className="outline-outline outline-1 rounded-lg px-4 py-2 flex gap-2 items-center animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="bg-bg-disabled text-lg rounded h-4 w-2/12 animate-pulse"/>
        <div className="bg-bg-secondary rounded h-2.5 w-5/12 animate-pulse"/>
      </div>
    </section>
  )
}
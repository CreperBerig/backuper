import { useTheme } from "next-themes";
import { SettingTile } from "../../components/tiles/SettingTile";
import { useSettingsFooter } from "../../contexts/SettingsFooterContext";
import { useEffect, useState } from "react";

export function LocalSettingsPage() {
  const { setFooter } = useSettingsFooter();

  const { theme: currentTheme, setTheme } = useTheme();

  const [ chosenTheme, setChosenTheme ] = useState<string>()

  const themes = ['light', 'dark', 'system'];

  useEffect(() => {
    if(chosenTheme)
      setFooter({
        isDisabled: !(chosenTheme === currentTheme),
        onSubmit: () => setTheme(chosenTheme),
        onCancel: () => setChosenTheme(currentTheme),
        changesCount: chosenTheme === currentTheme ? 0 : 1,
      })
  }, [chosenTheme])

  useEffect(() => {
    setChosenTheme(currentTheme)
  }, [currentTheme])

  useEffect(() => {
    document.title = 'Backuper | Local settings';
  })

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <p className="text-xl font-semibold">Local</p>
        <p className="text-text-description">This settings for local web client application</p>
      </div>
      <SettingTile title="Theme switcher" description="Chose theme for application">
        <div className="rounded-lg p-1 flex gap-1 border-outline border">
          {themes.map((theme) => (
            <button className={`rounded px-2.5 py-1 ${chosenTheme === theme ? 'bg-accent text-text-on-accent' : 'hover:bg-bg-secondary'}`} onClick={() => setChosenTheme(theme)}>{theme}</button>
          ))}
        </div>
      </SettingTile>
    </div>
  )
}

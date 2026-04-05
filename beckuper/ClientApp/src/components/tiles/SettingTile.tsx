import type { PropsWithChildren } from "react";

interface Props {
  title: string;
  description: string;
}

export function SettingTile({title, description, children}: PropsWithChildren<Props>) {
  return (
    <section className="outline-outline outline-1 rounded-lg px-4 py-2 flex gap-2 items-center">
      <div className="flex-1">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-text-description">{description}</p>
      </div>
      {children}
    </section>
  )
}

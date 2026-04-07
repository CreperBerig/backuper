import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    document.title = 'Backuper';
  })

  return (
    <div>
      <p className="text-text-primary">HomePage</p>
    </div>
  )
}

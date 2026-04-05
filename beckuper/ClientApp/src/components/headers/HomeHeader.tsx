interface Props {
  className: string;
}

export function HomeHeader({className}: Props) {
  return (
    <div className={"p-4 border-b border-outline " + className}>
      <p className="text-2xl font-bold">Backuper</p>
    </div>
  )
}

interface Props {
  title: string | undefined;
  description: string;
  reason: string;
}

export function SettingsErrorView({title, description, reason}: Props) {
  return <div className="h-full flex items-center justify-center flex-col gap-0.75">
    <p className="text-text-primary font-bold text-3xl">{title ? title : 'Error'}</p>
    <p className="text-text-description text-lg font-medium">{description}</p>
    <p className="text-text-description">reason: {reason}</p>
  </div>
}

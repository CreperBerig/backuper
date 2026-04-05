import { useEffect, useState } from "react"
import { type AppSettingsResponse } from "../../models/response/appSetings"
import { fetchAppSettings } from "../../api/appSettingsApi";
import { SettingTile } from "../../components/tiles/SettingTile";
import { useSettingsFooter } from "../../contexts/SettingsFooterContext";

export function AppSettingsPage() {
  const { setFooter } = useSettingsFooter();

  const [settings, setSettings] = useState<AppSettingsResponse>();

  const [retryCount, setRetryCount] = useState<number>();
  const [retryDelayMinutes, setRetryDelayMinutes] = useState<number>();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSubmiting, setSubmitting] = useState<boolean>(false);
  const [isFulled, setIsFulled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var response = await fetchAppSettings.get()
        setSettings(response);
      } catch (error) {
        console.log(error)
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if(settings) {
      setRetryCount(settings.retryCount);
      setRetryDelayMinutes(settings.retryDelayMinutes);
    }
  }, [settings])

  useEffect(() => {
    const isCountValid = retryCount !== undefined && !Number.isNaN(retryCount);
    const isDelayValid = retryDelayMinutes !== undefined && !Number.isNaN(retryDelayMinutes);

    if (isCountValid && isDelayValid) {
      setIsFulled(true);
    } else {
      setIsFulled(false);
    }
  }, [retryCount, retryDelayMinutes])

  useEffect(() => {
    const changesCount = [
      retryCount !== settings?.retryCount,
      retryDelayMinutes !== settings?.retryDelayMinutes,
    ].filter(Boolean).length;

    setFooter({
      changesCount,
      isDisabled: !isFulled || changesCount === 0 || isSubmiting,
      onSubmit: handleSubmit,
      onCancel: handleCancel,
    });
  }, [retryCount, retryDelayMinutes, isFulled, isSubmiting, settings])

  const handleCancel = () => {
    if (settings) {
      setRetryCount(settings.retryCount);
      setRetryDelayMinutes(settings.retryDelayMinutes);
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if(retryCount && retryDelayMinutes) {
        const newSettings: AppSettingsResponse = {
          retryCount,
          retryDelayMinutes,
        }
        await fetchAppSettings.update(newSettings);
        setSettings(newSettings);
      }
    } catch (error) {
      console.log(error);
      setError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if(isLoading) {
    return <div>Loading...</div>
  }

  if(error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-2">
      <SettingTile title="Retry count" description="The number of attempts to make a backup again if it was canceled due to an error">
        <input 
          type="number"
          min={0}
          value={retryCount}
          onChange={(e) => setRetryCount(Number.parseInt(e.currentTarget.value))}
          placeholder="retry count number"
        />
      </SettingTile>
      <SettingTile title="Retry delay minutes" description="The amount of time that must elapse after the previous backup attempt">
        <input 
          type="number"
          min={0}
          value={retryDelayMinutes}
          onChange={(e) => setRetryDelayMinutes(Number.parseInt(e.currentTarget.value))}
          placeholder="retry delay in minutes"
        />
      </SettingTile>
    </div>
  )
}

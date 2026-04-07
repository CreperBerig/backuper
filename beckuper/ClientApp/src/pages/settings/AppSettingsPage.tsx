import { useEffect, useState } from "react"
import { type AppSettingsResponse } from "../../models/response/appSetings"
import { fetchAppSettings } from "../../api/appSettingsApi";
import { SettingTile } from "../../components/tiles/SettingTile";
import { useSettingsFooter } from "../../contexts/SettingsFooterContext";
import { SettingsSuspenseView } from "../../components/suspenses/SettingsSuspenseView";
import { SettingsErrorView } from "../../components/errors/SettingsErrorView";
import type { AxiosError } from "axios";

export function AppSettingsPage() {
  const { setFooter } = useSettingsFooter();

  const [settings, setSettings] = useState<AppSettingsResponse>();

  const [retryCount, setRetryCount] = useState<number>();
  const [retryDelayMinutes, setRetryDelayMinutes] = useState<number>();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError>();

  const [isSubmiting, setSubmitting] = useState<boolean>(false);
  const [isFulled, setIsFulled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        var response = await fetchAppSettings.get()
        setSettings(response);
      } catch (error) {
        console.log(error)
        setError((error as AxiosError));
      } finally {
        setLoading(false);
      }
    }

    fetchData()
    document.title = 'Backuper | Retry settings';
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
      setError((error as AxiosError));
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <SettingsSuspenseView />
  }

  if(error) {
    return <SettingsErrorView title={error.code} description="Failed to load retry backup settings" reason={error.message}/>
  }

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <p className="text-xl font-semibold">Backup retry settings</p>
        <p className="text-text-description">This settings for configuration retry backup if it was canceled due to an error</p>
      </div>
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

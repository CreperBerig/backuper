
import type { AppSettingsRequest } from "../models/request/appSetings";
import type { AppSettingsResponse } from "../models/response/appSetings";
import { apiClient } from "./axios";

const APP_SETTINGS_API_URL = '/AppSettings';

export const fetchAppSettings = {
  get: async () => {
    const response = await apiClient.get<AppSettingsResponse>(`${APP_SETTINGS_API_URL}`);
    console.log('Get app settings response:', response);
    return response.data;
  },
  update: async (settings: AppSettingsRequest) => {
    console.log('Update app settings request:', settings);
    const response = await apiClient.put<AppSettingsResponse>(`${APP_SETTINGS_API_URL}`, settings);
    console.log('Update app settings response:', response);
    return response.data;
  },
} 
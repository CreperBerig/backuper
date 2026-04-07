import type { BackupInfo } from "../models/response/backupInfo";
import { apiClient } from "./axios";

const BACKUPS_API_URL = '/Backups';

export const fetchBackups = {
  get: async () => {
    const response = await apiClient.get<BackupInfo[]>(`${BACKUPS_API_URL}`);
    console.log('Get backups response:', response);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<BackupInfo>(`${BACKUPS_API_URL}/${id}`);
    console.log('Get backup by ID response:', response);
    return response.data;
  },
  getByDatabaseConfigId: async (databaseConfigId: number) => {
    const response = await apiClient.get<BackupInfo[]>(`${BACKUPS_API_URL}/database/${databaseConfigId}`);
    console.log('Get backups by database config ID response:', response);
    return response.data;
  },
  downloadBackup: async (id: number) => {
    const response = await apiClient.get(`${BACKUPS_API_URL}/${id}/download`, {
      responseType: 'blob',
    });
    console.log('Download backup response:', response);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${BACKUPS_API_URL}/${id}`);
    console.log('Delete backup response:', response);
    return response.data;
  },
  createManual: async (databaseConfigId: number) => {
    const response = await apiClient.post(`${BACKUPS_API_URL}/database/${databaseConfigId}`);
    console.log('Create manual backup response:', response);
    return response.data;
  }
} 
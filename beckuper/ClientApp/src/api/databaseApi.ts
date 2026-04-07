import type { DatabaseConfigRequest } from "../models/request/databaseConfig";
import { type DatabaseConfigMinimalResponse, type DatabaseConfigResponse } from "../models/response/databaseConfig";
import { apiClient } from "./axios";

const DATABASE_API_URL = '/databases';

export const fetchDatabaseConfig = {
  getAll: async () => {
    const response = await apiClient.get<DatabaseConfigResponse[]>(`${DATABASE_API_URL}`);
    console.log('Get all response:', response);
    return response.data;
  },
  getAllMinimal: async () => {
    const response = await apiClient.get<DatabaseConfigMinimalResponse[]>(`${DATABASE_API_URL}/minimal`);
    console.log('Get all minimal response:', response);
    return response.data;
  },
  getById: async (id: number) => {
    console.log(`Fetching database config with ID: ${id}`);
    const response = await apiClient.get<DatabaseConfigResponse>(`${DATABASE_API_URL}/by-id/${id}`);
    console.log('Get by ID response:', response);
    return response.data;
  },
  testConnectionById: async (id: number) => {
    const response = await apiClient.post(`${DATABASE_API_URL}/test/${id}`);
    console.log('Test connection response:', response);
    return response.data;
  },
  testConnectionByConfig: async (data: Partial<DatabaseConfigRequest>) => {
    const response = await apiClient.post(`${DATABASE_API_URL}/test`, data);
    console.log('Test connection response:', response);
    return response.data;
  },
  create: async (data: DatabaseConfigRequest) => {
    console.log('Creating database config with data:', data);
    const response = await apiClient.post(`${DATABASE_API_URL}`, data);
    console.log('Create response:', response);
    return response.data;
  },
  update: async (id: number, data: DatabaseConfigRequest) => {
    const response = await apiClient.put(`${DATABASE_API_URL}/${id}`, data);
    console.log('Update response:', response);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${DATABASE_API_URL}/${id}`);
    console.log('Delete response:', response);
    return response.data;
  }
} 
import axios from "axios";

export const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     console.error('Error API:', error);
//     return Promise.reject(error);
//   }
// );
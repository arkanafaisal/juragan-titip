// src/utils/api.ts
import { fetcher } from "./fetcher";
import apiMessages from "../helpers/apiMessages";
import type { Consignment, Product } from "../types/dashboard";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  httpCode: number;
}

const api = {
  auth: {
    login: async ({ identifier, password }: { identifier: string, password: string }): Promise<ApiResponse<{ accessToken: string, user: { username: string, email?: string } }>> => {
      const response = await fetcher('auth/login', { 
        method: 'POST', 
        body: { identifier, password },
        credentials: 'include' 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.login(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      
      return { success, message, data, httpCode };
    },
    
    register: async ({ username, email, password }: { username: string, email?: string, password: string }): Promise<ApiResponse<{ accessToken: string, user: { username: string, email?: string } }>> => {
      const response = await fetcher('auth/register', { 
        method: 'POST', 
        body: { username, email, password },
        credentials: 'include' 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.register(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      return { success, message, data, httpCode };
    },
    
    logout: async (): Promise<ApiResponse<null>> => {
      const response = await fetcher('auth/logout', { 
        method: 'POST',
        credentials: 'include'
      }, true);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.logout(response);
      
      return { success, message, data: null, httpCode };
    },
  },

  users: {
    getMe: async (): Promise<ApiResponse<{ username: string, email: string | null }>> => {
      const response = await fetcher('users', { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.users.getMe(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      
      return { success, message, data, httpCode };
    },
  },

  products: {
    getAll: async (): Promise<ApiResponse<Product[]>> => {
      const response = await fetcher('products', { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.products.getAll(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      
      return { success, message, data, httpCode };
    },
  },

  titipan: {
    getAll: async (): Promise<ApiResponse<Consignment[]>> => {
      const response = await fetcher('titipan', { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.titipan.getAll(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      
      return { success, message, data, httpCode };
    },

    create: async (payload: Omit<Consignment, 'id'>): Promise<ApiResponse<Consignment>> => {
      const response = await fetcher('titipan', { 
        method: 'POST', 
        body: payload 
      });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.titipan.create(response);
      
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      
      return { success, message, data, httpCode };
    },
  }
};

export default api;

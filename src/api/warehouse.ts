import { handleApiCall } from './core';
import * as Types from '../types';

export const grn = { 
  list: () => handleApiCall<Types.GoodsReceivedNote[]>('/api/v1/warehouse/grn'), 
  create: (data: Omit<Types.GoodsReceivedNote, 'id'>) => handleApiCall<Types.GoodsReceivedNote>('/api/v1/warehouse/grn', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.GoodsReceivedNote>) => handleApiCall<Types.GoodsReceivedNote>(`/api/v1/warehouse/grn/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/warehouse/grn/${id}`, { method: 'DELETE' })
};

export const binCard = { 
  list: () => handleApiCall<Types.BinCardEntry[]>('/api/v1/warehouse/bin-card'), 
  create: (data: Omit<Types.BinCardEntry, 'id'>) => handleApiCall<Types.BinCardEntry>('/api/v1/warehouse/bin-card', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.BinCardEntry>) => handleApiCall<Types.BinCardEntry>(`/api/v1/warehouse/bin-card/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/warehouse/bin-card/${id}`, { method: 'DELETE' })
};

export const inventoryAlerts = { 
  list: () => handleApiCall<Types.InventoryAlert[]>('/api/v1/warehouse/inventory-alerts'),
  create: (data: Omit<Types.InventoryAlert, 'id'>) => handleApiCall<Types.InventoryAlert>('/api/v1/warehouse/inventory-alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.InventoryAlert>) => handleApiCall<Types.InventoryAlert>(`/api/v1/warehouse/inventory-alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/warehouse/inventory-alerts/${id}`, { method: 'DELETE' })
};

export const stocks = {
  list: () => handleApiCall<Types.Stock[]>('/api/v1/warehouse/stocks'),
  create: (data: Omit<Types.Stock, 'id'>) => handleApiCall<Types.Stock>('/api/v1/warehouse/stocks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Stock>) => handleApiCall<Types.Stock>(`/api/v1/warehouse/stocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/warehouse/stocks/${id}`, { method: 'DELETE' })
};
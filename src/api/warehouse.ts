import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const grn = { 
  list: () => handleApiCall(() => getMock<Types.GoodsReceivedNote>('grn'), '/api/v1/warehouse/grn'), 
  create: (data: Omit<Types.GoodsReceivedNote, 'id'>) => handleApiCall(() => addMock('grn', data), '/api/v1/warehouse/grn', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.GoodsReceivedNote>) => handleApiCall(() => data as any, `/api/v1/warehouse/grn/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/warehouse/grn/${id}`, { method: 'DELETE' })
};

export const binCard = { 
  list: () => handleApiCall(() => getMock<Types.BinCardEntry>('binCard'), '/api/v1/warehouse/bin-card'), 
  create: (data: Omit<Types.BinCardEntry, 'id'>) => handleApiCall(() => addMock('binCard', data), '/api/v1/warehouse/bin-card', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.BinCardEntry>) => handleApiCall(() => data as any, `/api/v1/warehouse/bin-card/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/warehouse/bin-card/${id}`, { method: 'DELETE' })
};

export const inventoryAlerts = { 
  list: () => handleApiCall(() => getMock<Types.InventoryAlert>('inventoryAlerts'), '/api/v1/warehouse/inventory-alerts'),
  create: (data: Omit<Types.InventoryAlert, 'id'>) => handleApiCall(() => addMock('inventoryAlerts', data as any), '/api/v1/warehouse/inventory-alerts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.InventoryAlert>) => handleApiCall(() => data as any, `/api/v1/warehouse/inventory-alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/warehouse/inventory-alerts/${id}`, { method: 'DELETE' })
};

export const stocks = {
  list: () => handleApiCall(() => getMock<Types.Stock>('stocks' as any), '/api/v1/warehouse/stocks'),
  create: (data: Omit<Types.Stock, 'id'>) => handleApiCall(() => addMock('stocks' as any, data as any), '/api/v1/warehouse/stocks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Stock>) => handleApiCall(() => data as any, `/api/v1/warehouse/stocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/warehouse/stocks/${id}`, { method: 'DELETE' })
};
import { handleApiCall } from './core';
import * as Types from '../types';

export const trucks = { 
  list: () => handleApiCall<Types.Truck[]>('/api/v1/logistics/trucks'), 
  create: (data: Omit<Types.Truck, 'id'>) => handleApiCall<Types.Truck>('/api/v1/logistics/trucks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Truck>) => handleApiCall<Types.Truck>(`/api/v1/logistics/trucks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/logistics/trucks/${id}`, { method: 'DELETE' })
};

export const trips = { 
  list: () => handleApiCall<Types.Trip[]>('/api/v1/logistics/trips'), 
  create: (data: Omit<Types.Trip, 'id'>) => handleApiCall<Types.Trip>('/api/v1/logistics/trips', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Trip>) => handleApiCall<Types.Trip>(`/api/v1/logistics/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/logistics/trips/${id}`, { method: 'DELETE' })
};

export const drivers = { 
  list: () => handleApiCall<Types.Driver[]>('/api/v1/logistics/drivers'), 
  create: (data: Omit<Types.Driver, 'id'>) => handleApiCall<Types.Driver>('/api/v1/logistics/drivers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Driver>) => handleApiCall<Types.Driver>(`/api/v1/logistics/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/logistics/drivers/${id}`, { method: 'DELETE' })
};

export const maintenance = { 
  list: () => handleApiCall<Types.MaintenanceLogEntry[]>('/api/v1/logistics/maintenances'), 
  create: (data: Omit<Types.MaintenanceLogEntry, 'id'>) => handleApiCall<Types.MaintenanceLogEntry>('/api/v1/logistics/maintenances', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MaintenanceLogEntry>) => handleApiCall<Types.MaintenanceLogEntry>(`/api/v1/logistics/maintenances/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/logistics/maintenances/${id}`, { method: 'DELETE' })
};

export const waybills = { 
  list: () => handleApiCall<Types.Waybill[]>('/api/v1/logistics/waybills'),
  create: (data: Omit<Types.Waybill, 'id'>) => handleApiCall<Types.Waybill>('/api/v1/logistics/waybills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Waybill>) => handleApiCall<Types.Waybill>(`/api/v1/logistics/waybills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/logistics/waybills/${id}`, { method: 'DELETE' })
};

export const logisticsOverview = {
  getSnapshot: () => handleApiCall<any>('/api/v1/logistics/overview/snapshot')
};
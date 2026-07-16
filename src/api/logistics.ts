import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const trucks = { 
  list: () => handleApiCall(() => getMock<Types.Truck>('trucks'), '/api/v1/logistics/trucks'), 
  create: (data: Omit<Types.Truck, 'id'>) => handleApiCall(() => addMock('trucks', data), '/api/v1/logistics/trucks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Truck>) => handleApiCall(() => data as any, `/api/v1/logistics/trucks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/logistics/trucks/${id}`, { method: 'DELETE' })
};

export const trips = { 
  list: () => handleApiCall(() => getMock<Types.Trip>('trips'), '/api/v1/logistics/trips'), 
  create: (data: Omit<Types.Trip, 'id'>) => handleApiCall(() => addMock('trips', data), '/api/v1/logistics/trips', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Trip>) => handleApiCall(() => data as any, `/api/v1/logistics/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/logistics/trips/${id}`, { method: 'DELETE' })
};

export const drivers = { 
  list: () => handleApiCall(() => getMock<Types.Driver>('drivers'), '/api/v1/logistics/drivers'), 
  create: (data: Omit<Types.Driver, 'id'>) => handleApiCall(() => addMock('drivers', data), '/api/v1/logistics/drivers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Driver>) => handleApiCall(() => data as any, `/api/v1/logistics/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/logistics/drivers/${id}`, { method: 'DELETE' })
};

export const maintenance = { 
  list: () => handleApiCall(() => getMock<Types.MaintenanceLogEntry>('maintenance'), '/api/v1/logistics/maintenances'), 
  create: (data: Omit<Types.MaintenanceLogEntry, 'id'>) => handleApiCall(() => addMock('maintenance', data), '/api/v1/logistics/maintenances', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MaintenanceLogEntry>) => handleApiCall(() => data as any, `/api/v1/logistics/maintenances/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/logistics/maintenances/${id}`, { method: 'DELETE' })
};

export const waybills = { 
  list: () => handleApiCall(() => getMock<Types.Waybill>('waybills'), '/api/v1/logistics/waybills'),
  create: (data: Omit<Types.Waybill, 'id'>) => handleApiCall(() => addMock('waybills', data as any), '/api/v1/logistics/waybills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Waybill>) => handleApiCall(() => data as any, `/api/v1/logistics/waybills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/logistics/waybills/${id}`, { method: 'DELETE' })
};
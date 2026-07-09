import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const trucks = { list: () => handleApiCall(() => getMock<Types.Truck>('trucks'), '/api/trucks'), create: (data: Omit<Types.Truck, 'id'>) => handleApiCall(() => addMock('trucks', data), '/api/trucks') };

export const trips = { list: () => handleApiCall(() => getMock<Types.Trip>('trips'), '/api/trips'), create: (data: Omit<Types.Trip, 'id'>) => handleApiCall(() => addMock('trips', data), '/api/trips') };

export const drivers = { list: () => handleApiCall(() => getMock<Types.Driver>('drivers'), '/api/drivers'), create: (data: Omit<Types.Driver, 'id'>) => handleApiCall(() => addMock('drivers', data), '/api/drivers') };

export const maintenance = { list: () => handleApiCall(() => getMock<Types.MaintenanceLogEntry>('maintenance'), '/api/maintenance'), create: (data: Omit<Types.MaintenanceLogEntry, 'id'>) => handleApiCall(() => addMock('maintenance', data), '/api/maintenance') };

export const waybills = { list: () => handleApiCall(() => getMock<Types.Waybill>('waybills'), '/api/waybills') };
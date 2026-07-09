import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const visitorLog = { list: () => handleApiCall(() => getMock<Types.VisitorLog>('visitorLog'), '/api/visitor-log'), create: (data: Omit<Types.VisitorLog, 'id'>) => handleApiCall(() => addMock('visitorLog', data), '/api/visitor-log') };

export const motorcycleLog = { list: () => handleApiCall(() => getMock<Types.MotorcycleLog>('motorcycleLog'), '/api/motorcycle-log'), create: (data: Omit<Types.MotorcycleLog, 'id'>) => handleApiCall(() => addMock('motorcycleLog', data), '/api/motorcycle-log') };

export const staffMovement = { list: () => handleApiCall(() => getMock<Types.StaffMovementLog>('staffMovement'), '/api/staff-movement'), create: (data: Omit<Types.StaffMovementLog, 'id'>) => handleApiCall(() => addMock('staffMovement', data), '/api/staff-movement') };

export const staffAttendance = { list: () => handleApiCall(() => getMock<Types.StaffAttendance>('staffAttendance'), '/api/st  aff-attendance'), create: (data: Omit<Types.StaffAttendance, 'id'>) => handleApiCall(() => addMock('staffAttendance', data), '/api/staff-attendance') };

export const dispatchRecord = { list: () => handleApiCall(() => getMock<Types.DispatchRecord>('dispatchRecord'), '/api/dispatch-record'), create: (data: Omit<Types.DispatchRecord, 'id'>) => handleApiCall(() => addMock('dispatchRecord', data), '/api/dispatch-record') };

export const itemBought = { list: () => handleApiCall(() => getMock<Types.ItemBought>('itemBought'), '/api/item-bought'), create: (data: Omit<Types.ItemBought, 'id'>) => handleApiCall(() => addMock('itemBought', data), '/api/item-bought') };

export const labourers = { list: () => handleApiCall(() => getMock<Types.LabourerLogEntry>('labourers'), '/api/labourers') };

export const lightTokens = { list: () => handleApiCall(() => getMock<Types.LightTokenEntry>('lightTokens'), '/api/light-tokens') };

export const materialsHandoff = { list: () => handleApiCall(() => getMock<Types.MaterialsHandoffEntry>('materialsHandoff'), '/api/materials-handoff') };

export const suppliers = { list: () => handleApiCall(() => getMock<Types.SupplierRecord>('suppliers'), '/api/suppliers'), create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall(() => addMock('suppliers', data), '/api/suppliers') };
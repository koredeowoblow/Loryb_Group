import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const visitorLog = { 
  list: () => handleApiCall(() => getMock<Types.VisitorLog>('visitorLog'), '/api/v1/security/visitor-log'), 
  create: (data: Omit<Types.VisitorLog, 'id'>) => handleApiCall(() => addMock('visitorLog', data), '/api/v1/security/visitor-log', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.VisitorLog>) => handleApiCall(() => data as any, `/api/v1/security/visitor-log/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/visitor-log/${id}`, { method: 'DELETE' })
};

export const motorcycleLog = { 
  list: () => handleApiCall(() => getMock<Types.MotorcycleLog>('motorcycleLog'), '/api/v1/security/motorcycle-log'), 
  create: (data: Omit<Types.MotorcycleLog, 'id'>) => handleApiCall(() => addMock('motorcycleLog', data), '/api/v1/security/motorcycle-log', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MotorcycleLog>) => handleApiCall(() => data as any, `/api/v1/security/motorcycle-log/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/motorcycle-log/${id}`, { method: 'DELETE' })
};

export const staffMovement = { 
  list: () => handleApiCall(() => getMock<Types.StaffMovementLog>('staffMovement'), '/api/v1/security/staff-movement'), 
  create: (data: Omit<Types.StaffMovementLog, 'id'>) => handleApiCall(() => addMock('staffMovement', data), '/api/v1/security/staff-movement', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.StaffMovementLog>) => handleApiCall(() => data as any, `/api/v1/security/staff-movement/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/staff-movement/${id}`, { method: 'DELETE' })
};

export const staffAttendance = { 
  list: () => handleApiCall(() => getMock<Types.StaffAttendance>('staffAttendance'), '/api/v1/security/staff-attendance'), 
  create: (data: Omit<Types.StaffAttendance, 'id'>) => handleApiCall(() => addMock('staffAttendance', data), '/api/v1/security/staff-attendance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.StaffAttendance>) => handleApiCall(() => data as any, `/api/v1/security/staff-attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/staff-attendance/${id}`, { method: 'DELETE' })
};

export const dispatchRecord = { 
  list: () => handleApiCall(() => getMock<Types.DispatchRecord>('dispatchRecord'), '/api/v1/security/dispatch-record'), 
  create: (data: Omit<Types.DispatchRecord, 'id'>) => handleApiCall(() => addMock('dispatchRecord', data), '/api/v1/security/dispatch-record', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.DispatchRecord>) => handleApiCall(() => data as any, `/api/v1/security/dispatch-record/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/dispatch-record/${id}`, { method: 'DELETE' })
};

export const itemBought = { 
  list: () => handleApiCall(() => getMock<Types.ItemBought>('itemBought'), '/api/v1/security/item-bought'), 
  create: (data: Omit<Types.ItemBought, 'id'>) => handleApiCall(() => addMock('itemBought', data), '/api/v1/security/item-bought', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.ItemBought>) => handleApiCall(() => data as any, `/api/v1/security/item-bought/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/item-bought/${id}`, { method: 'DELETE' })
};

export const labourers = { 
  list: () => handleApiCall(() => getMock<Types.LabourerLogEntry>('labourers'), '/api/v1/security/labourers'),
  create: (data: Omit<Types.LabourerLogEntry, 'id'>) => handleApiCall(() => addMock('labourers', data as any), '/api/v1/security/labourers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.LabourerLogEntry>) => handleApiCall(() => data as any, `/api/v1/security/labourers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/labourers/${id}`, { method: 'DELETE' })
};

export const lightTokens = { 
  list: () => handleApiCall(() => getMock<Types.LightTokenEntry>('lightTokens'), '/api/v1/security/light-tokens'),
  create: (data: Omit<Types.LightTokenEntry, 'id'>) => handleApiCall(() => addMock('lightTokens', data as any), '/api/v1/security/light-tokens', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.LightTokenEntry>) => handleApiCall(() => data as any, `/api/v1/security/light-tokens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/light-tokens/${id}`, { method: 'DELETE' })
};

export const materialsHandoff = { 
  list: () => handleApiCall(() => getMock<Types.MaterialsHandoffEntry>('materialsHandoff'), '/api/v1/security/materials-handoff'),
  create: (data: Omit<Types.MaterialsHandoffEntry, 'id'>) => handleApiCall(() => addMock('materialsHandoff', data as any), '/api/v1/security/materials-handoff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MaterialsHandoffEntry>) => handleApiCall(() => data as any, `/api/v1/security/materials-handoff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/materials-handoff/${id}`, { method: 'DELETE' })
};

export const suppliers = { 
  list: () => handleApiCall(() => getMock<Types.SupplierRecord>('suppliers'), '/api/v1/security/suppliers'), 
  create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall(() => addMock('suppliers', data), '/api/v1/security/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierRecord>) => handleApiCall(() => data as any, `/api/v1/security/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/suppliers/${id}`, { method: 'DELETE' })
};
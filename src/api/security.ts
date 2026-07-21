import { handleApiCall } from './core';
import * as Types from '../types';

export const visitorLog = { 
  list: () => handleApiCall<Types.VisitorLog[]>('/api/v1/security/visitor-log'), 
  create: (data: Omit<Types.VisitorLog, 'id'>) => handleApiCall<Types.VisitorLog>('/api/v1/security/visitor-log', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.VisitorLog>) => handleApiCall<Types.VisitorLog>(`/api/v1/security/visitor-log/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/visitor-log/${id}`, { method: 'DELETE' })
};

export const motorcycleLog = { 
  list: () => handleApiCall<Types.MotorcycleLog[]>('/api/v1/security/motorcycle-log'), 
  create: (data: Omit<Types.MotorcycleLog, 'id'>) => handleApiCall<Types.MotorcycleLog>('/api/v1/security/motorcycle-log', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MotorcycleLog>) => handleApiCall<Types.MotorcycleLog>(`/api/v1/security/motorcycle-log/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/motorcycle-log/${id}`, { method: 'DELETE' })
};

export const staffMovement = { 
  list: () => handleApiCall<Types.StaffMovementLog[]>('/api/v1/security/staff-movement'), 
  create: (data: Omit<Types.StaffMovementLog, 'id'>) => handleApiCall<Types.StaffMovementLog>('/api/v1/security/staff-movement', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.StaffMovementLog>) => handleApiCall<Types.StaffMovementLog>(`/api/v1/security/staff-movement/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/staff-movement/${id}`, { method: 'DELETE' })
};

export const staffAttendance = { 
  list: () => handleApiCall<Types.StaffAttendance[]>('/api/v1/security/staff-attendance'), 
  create: (data: Omit<Types.StaffAttendance, 'id'>) => handleApiCall<Types.StaffAttendance>('/api/v1/security/staff-attendance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.StaffAttendance>) => handleApiCall<Types.StaffAttendance>(`/api/v1/security/staff-attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/staff-attendance/${id}`, { method: 'DELETE' })
};

export const dispatchRecord = { 
  list: () => handleApiCall<Types.DispatchRecord[]>('/api/v1/security/dispatch-record'), 
  create: (data: Omit<Types.DispatchRecord, 'id'>) => handleApiCall<Types.DispatchRecord>('/api/v1/security/dispatch-record', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.DispatchRecord>) => handleApiCall<Types.DispatchRecord>(`/api/v1/security/dispatch-record/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/dispatch-record/${id}`, { method: 'DELETE' })
};

export const itemBought = { 
  list: () => handleApiCall<Types.ItemBought[]>('/api/v1/security/item-bought'), 
  create: (data: Omit<Types.ItemBought, 'id'>) => handleApiCall<Types.ItemBought>('/api/v1/security/item-bought', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.ItemBought>) => handleApiCall<Types.ItemBought>(`/api/v1/security/item-bought/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/item-bought/${id}`, { method: 'DELETE' })
};

export const labourers = { 
  list: () => handleApiCall<Types.LabourerLogEntry[]>('/api/v1/security/labourers'),
  create: (data: Omit<Types.LabourerLogEntry, 'id'>) => handleApiCall<Types.LabourerLogEntry>('/api/v1/security/labourers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.LabourerLogEntry>) => handleApiCall<Types.LabourerLogEntry>(`/api/v1/security/labourers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/labourers/${id}`, { method: 'DELETE' })
};

export const lightTokens = { 
  list: () => handleApiCall<Types.LightTokenEntry[]>('/api/v1/security/light-tokens'),
  create: (data: Omit<Types.LightTokenEntry, 'id'>) => handleApiCall<Types.LightTokenEntry>('/api/v1/security/light-tokens', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.LightTokenEntry>) => handleApiCall<Types.LightTokenEntry>(`/api/v1/security/light-tokens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/light-tokens/${id}`, { method: 'DELETE' })
};

export const materialsHandoff = { 
  list: () => handleApiCall<Types.MaterialsHandoffEntry[]>('/api/v1/security/materials-handoff'),
  create: (data: Omit<Types.MaterialsHandoffEntry, 'id'>) => handleApiCall<Types.MaterialsHandoffEntry>('/api/v1/security/materials-handoff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.MaterialsHandoffEntry>) => handleApiCall<Types.MaterialsHandoffEntry>(`/api/v1/security/materials-handoff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/materials-handoff/${id}`, { method: 'DELETE' })
};

export const suppliers = { 
  list: () => handleApiCall<Types.SupplierRecord[]>('/api/v1/security/suppliers'), 
  create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall<Types.SupplierRecord>('/api/v1/security/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierRecord>) => handleApiCall<Types.SupplierRecord>(`/api/v1/security/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/suppliers/${id}`, { method: 'DELETE' })
};
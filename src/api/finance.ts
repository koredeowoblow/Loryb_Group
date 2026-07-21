import { handleApiCall } from './core';
import * as Types from '../types';

export const invoices = { 
  list: () => handleApiCall<Types.Invoice[]>('/api/v1/finance/invoices'), 
  create: (data: Omit<Types.Invoice, 'id'>) => handleApiCall<Types.Invoice>('/api/v1/finance/invoices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Invoice>) => handleApiCall<Types.Invoice>(`/api/v1/finance/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/finance/invoices/${id}`, { method: 'DELETE' })
};

export const expenses = { 
  list: () => handleApiCall<Types.Expense[]>('/api/v1/finance/expenses'), 
  create: (data: Omit<Types.Expense, 'id'>) => handleApiCall<Types.Expense>('/api/v1/finance/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Expense>) => handleApiCall<Types.Expense>(`/api/v1/finance/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/finance/expenses/${id}`, { method: 'DELETE' })
};

export const payroll = { 
  list: () => handleApiCall<Types.PayrollEntry[]>('/api/v1/finance/payroll'), 
  create: (data: Omit<Types.PayrollEntry, 'id'>) => handleApiCall<Types.PayrollEntry>('/api/v1/finance/payroll', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.PayrollEntry>) => handleApiCall<Types.PayrollEntry>(`/api/v1/finance/payroll/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/finance/payroll/${id}`, { method: 'DELETE' })
};

export const supplierPayments = { 
  list: () => handleApiCall<Types.SupplierPayment[]>('/api/v1/finance/supplier-payments'), 
  create: (data: Omit<Types.SupplierPayment, 'id'>) => handleApiCall<Types.SupplierPayment>('/api/v1/finance/supplier-payments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierPayment>) => handleApiCall<Types.SupplierPayment>(`/api/v1/finance/supplier-payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/finance/supplier-payments/${id}`, { method: 'DELETE' })
};

export const sales = { 
  list: () => handleApiCall<Types.Sale[]>('/api/v1/finance/sales'), 
  create: (data: Omit<Types.Sale, 'id'>) => handleApiCall<Types.Sale>('/api/v1/finance/sales', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Sale>) => handleApiCall<Types.Sale>(`/api/v1/finance/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/finance/sales/${id}`, { method: 'DELETE' })
};
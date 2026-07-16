import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const invoices = { 
  list: () => handleApiCall(() => getMock<Types.Invoice>('invoices'), '/api/v1/finance/invoices'), 
  create: (data: Omit<Types.Invoice, 'id'>) => handleApiCall(() => addMock('invoices', data), '/api/v1/finance/invoices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Invoice>) => handleApiCall(() => data as any, `/api/v1/finance/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/finance/invoices/${id}`, { method: 'DELETE' })
};

export const expenses = { 
  list: () => handleApiCall(() => getMock<Types.Expense>('expenses'), '/api/v1/finance/expenses'), 
  create: (data: Omit<Types.Expense, 'id'>) => handleApiCall(() => addMock('expenses', data), '/api/v1/finance/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Expense>) => handleApiCall(() => data as any, `/api/v1/finance/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/finance/expenses/${id}`, { method: 'DELETE' })
};

export const payroll = { 
  list: () => handleApiCall(() => getMock<Types.PayrollEntry>('payroll'), '/api/v1/finance/payroll'), 
  create: (data: Omit<Types.PayrollEntry, 'id'>) => handleApiCall(() => addMock('payroll', data), '/api/v1/finance/payroll', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.PayrollEntry>) => handleApiCall(() => data as any, `/api/v1/finance/payroll/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/finance/payroll/${id}`, { method: 'DELETE' })
};

export const supplierPayments = { 
  list: () => handleApiCall(() => getMock<Types.SupplierPayment>('supplierPayments'), '/api/v1/finance/supplier-payments'), 
  create: (data: Omit<Types.SupplierPayment, 'id'>) => handleApiCall(() => addMock('supplierPayments', data), '/api/v1/finance/supplier-payments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierPayment>) => handleApiCall(() => data as any, `/api/v1/finance/supplier-payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/finance/supplier-payments/${id}`, { method: 'DELETE' })
};

export const sales = { 
  list: () => handleApiCall(() => getMock<Types.Sale>('sales'), '/api/v1/finance/sales'), 
  create: (data: Omit<Types.Sale, 'id'>) => handleApiCall(() => addMock('sales', data), '/api/v1/finance/sales', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Sale>) => handleApiCall(() => data as any, `/api/v1/finance/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/finance/sales/${id}`, { method: 'DELETE' })
};
import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const invoices = { list: () => handleApiCall(() => getMock<Types.Invoice>('invoices'), '/api/invoices'), create: (data: Omit<Types.Invoice, 'id'>) => handleApiCall(() => addMock('invoices', data), '/api/invoices') };

export const expenses = { list: () => handleApiCall(() => getMock<Types.Expense>('expenses'), '/api/expenses'), create: (data: Omit<Types.Expense, 'id'>) => handleApiCall(() => addMock('expenses', data), '/api/expenses') };

export const payroll = { list: () => handleApiCall(() => getMock<Types.PayrollEntry>('payroll'), '/api/payroll'), create: (data: Omit<Types.PayrollEntry, 'id'>) => handleApiCall(() => addMock('payroll', data), '/api/payroll') };

export const supplierPayments = { list: () => handleApiCall(() => getMock<Types.SupplierPayment>('supplierPayments'), '/api/supplier-payments'), create: (data: Omit<Types.SupplierPayment, 'id'>) => handleApiCall(() => addMock('supplierPayments', data), '/api/supplier-payments') };

export const sales = { list: () => handleApiCall(() => getMock<Types.Sale>('sales'), '/api/sales'), create: (data: Omit<Types.Sale, 'id'>) => handleApiCall(() => addMock('sales', data), '/api/sales') };
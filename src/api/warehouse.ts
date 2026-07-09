import { handleApiCall } from './core';
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const grn = { list: () => handleApiCall(() => getMock<Types.GoodsReceivedNote>('grn'), '/api/grn'), create: (data: Omit<Types.GoodsReceivedNote, 'id'>) => handleApiCall(() => addMock('grn', data), '/api/grn') };

export const binCard = { list: () => handleApiCall(() => getMock<Types.BinCardEntry>('binCard'), '/api/bin-card'), create: (data: Omit<Types.BinCardEntry, 'id'>) => handleApiCall(() => addMock('binCard', data), '/api/bin-card') };

export const inventoryAlerts = { list: () => handleApiCall(() => getMock<Types.InventoryAlert>('inventoryAlerts'), '/api/inventory-alerts') };
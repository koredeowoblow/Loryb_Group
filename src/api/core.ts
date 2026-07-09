import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const USE_MOCK_DATA = true;

 async function handleApiCall<T>(mockData: () => T, endpoint: string): Promise<T> {
  if (USE_MOCK_DATA) {
    await new Promise(r => setTimeout(r, 500))
    return mockData()
  }
  const response = await fetch(endpoint)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }
  const json = await response.json();
  const data = json.data !== undefined ? json.data : json;
  if (json.meta && typeof data === 'object') {
    (data as any).meta = json.meta;
  }
  return data;
}
export { handleApiCall };

export const auth = {
    login: async (credentials: any) => {
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 500))
        const users = getMock<Types.User>('users')
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password)
        if (user) {
          const { password, ...userWithoutPassword } = user
          return { user: userWithoutPassword, token: 'mock-jwt-token' }
        }
        throw new Error('Invalid email or password')
      }
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }
      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    }
  };

export const orgSettings = { get: () => handleApiCall(() => ({ id: '1', companyName: 'LORYB Group', siteName: 'Greenville Depot', address: 'Lagos', contactEmail: 'admin@loryb.com', contactPhone: '08000000000', grainTypes: ['Maize', 'Sorghum', 'SoyaBeans'], logoUrl: '' }), '/api/org-settings') };

export const suppliers = { list: () => handleApiCall(() => getMock<Types.SupplierRecord>('suppliers'), '/api/suppliers'), create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall(() => addMock('suppliers', data), '/api/suppliers') };
import { getMock, addMock } from '../mocks/db';
import * as Types from '../types';

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

 async function handleApiCall<T>(mockData: () => T, endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    await new Promise(r => setTimeout(r, 500))
    return mockData()
  }
  const token = localStorage.getItem('loryb_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(endpoint, { ...options, headers })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }
  const json = await response.json();
  let data = json.data !== undefined ? json.data : json;
  
  if (Array.isArray(data)) {
    data = data.map((item: any) => {
      if (item._id && !item.id) item.id = item._id;
      return item;
    });
  } else if (data && typeof data === 'object') {
    if (data._id && !data.id) data.id = data._id;
  }
  
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
      const response = await fetch('/api/v1/auth/login', {
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

export const orgSettings = {
  get: () => handleApiCall(() => getMock<Types.OrgSettings>('orgSettings')[0] as Types.OrgSettings, '/api/v1/org-settings'),
  update: (data: Partial<Types.OrgSettings>) => handleApiCall(() => data as any, '/api/v1/org-settings', { method: 'PUT', body: JSON.stringify(data) })
};

export const profile = {
  get: () => handleApiCall(() => getMock<Types.User>('profile')[0] as Types.User, '/api/v1/profile'),
  update: (data: Partial<Types.User>) => handleApiCall(() => data as any, '/api/v1/profile', { method: 'PUT', body: JSON.stringify(data) })
};

export const roles = {
  list: () => handleApiCall(() => getMock<Types.Role>('roles'), '/api/v1/roles'),
  create: (data: Omit<Types.Role, 'id'>) => handleApiCall(() => addMock('roles', data), '/api/v1/roles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Role>) => handleApiCall(() => data as any, `/api/v1/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/roles/${id}`, { method: 'DELETE' })
};

export const users = {
  list: () => handleApiCall(() => getMock<Types.User>('users'), '/api/v1/users'),
  create: (data: Omit<Types.User, 'id'>) => handleApiCall(() => addMock('users', data), '/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.User>) => handleApiCall(() => data as any, `/api/v1/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/users/${id}`, { method: 'DELETE' })
};
export const suppliers = { 
  list: () => handleApiCall(() => getMock<Types.SupplierRecord>('suppliers'), '/api/v1/security/suppliers'), 
  create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall(() => addMock('suppliers', data), '/api/v1/security/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierRecord>) => handleApiCall(() => data as any, `/api/v1/security/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall(() => ({}), `/api/v1/security/suppliers/${id}`, { method: 'DELETE' })
};
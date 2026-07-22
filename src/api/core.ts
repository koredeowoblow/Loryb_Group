import * as Types from '../types';

export const USE_MOCK_DATA = false;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

async function handleApiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('loryb_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers })
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('loryb_token');
      window.dispatchEvent(new Event('loryb_unauthorized'));
    }
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
    const url = `/api/v1/auth/login`.startsWith('http') ? `/api/v1/auth/login` : `${BACKEND_URL}/api/v1/auth/login`;
    const response = await fetch(url, {
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
  get: () => handleApiCall<Types.OrgSettings>('/api/v1/org-settings'),
  update: (data: Partial<Types.OrgSettings>) => handleApiCall<Types.OrgSettings>('/api/v1/org-settings', { method: 'PUT', body: JSON.stringify(data) })
};

export const profile = {
  get: () => handleApiCall<Types.User>('/api/v1/profile'),
  update: (data: Partial<Types.User>) => handleApiCall<Types.User>('/api/v1/profile', { method: 'PUT', body: JSON.stringify(data) })
};

export const roles = {
  list: () => handleApiCall<Types.Role[]>('/api/v1/roles'),
  create: (data: Omit<Types.Role, 'id'>) => handleApiCall<Types.Role>('/api/v1/roles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Role>) => handleApiCall<Types.Role>(`/api/v1/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/roles/${id}`, { method: 'DELETE' })
};

export const users = {
  list: () => handleApiCall<Types.User[]>('/api/v1/users'),
  create: (data: Omit<Types.User, 'id'>) => handleApiCall<Types.User>('/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.User>) => handleApiCall<Types.User>(`/api/v1/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/users/${id}`, { method: 'DELETE' })
};

export const suppliers = { 
  list: () => handleApiCall<Types.SupplierRecord[]>('/api/v1/security/suppliers'), 
  create: (data: Omit<Types.SupplierRecord, 'id'>) => handleApiCall<Types.SupplierRecord>('/api/v1/security/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.SupplierRecord>) => handleApiCall<Types.SupplierRecord>(`/api/v1/security/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/security/suppliers/${id}`, { method: 'DELETE' })
};

export const branches = {
  list: () => handleApiCall<Types.Branch[]>('/api/v1/branches'),
  get: (id: string) => handleApiCall<Types.Branch>(`/api/v1/branches/${id}`),
  create: (data: Omit<Types.Branch, 'id'>) => handleApiCall<Types.Branch>('/api/v1/branches', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Branch>) => handleApiCall<Types.Branch>(`/api/v1/branches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/branches/${id}`, { method: 'DELETE' }),
  getStaff: (id: string) => handleApiCall<Types.Staff[]>(`/api/v1/branches/${id}/staff`),
  getAttendance: (id: string, skip: number = 0, limit: number = 20) => handleApiCall<{ data: Types.AttendanceLog[], total: number }>(`/api/v1/branches/${id}/attendance?skip=${skip}&limit=${limit}`),
  getProductionSummary: (id: string, startDate: string, endDate: string) => handleApiCall<any[]>(`/api/v1/branches/${id}/production?startDate=${startDate}&endDate=${endDate}`)
};

export const staff = {
  search: (query: string) => handleApiCall<any[]>(`/api/v1/staff/search?query=${query}`),
  list: () => handleApiCall<Types.Staff[]>('/api/v1/staff'),
  get: (id: string) => handleApiCall<Types.Staff>(`/api/v1/staff/${id}`),
  create: (data: Omit<Types.Staff, 'id'>) => handleApiCall<Types.Staff>('/api/v1/staff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Staff>) => handleApiCall<Types.Staff>(`/api/v1/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/staff/${id}`, { method: 'DELETE' })
};

export const attendance = {
  scan: (staffId: string) => handleApiCall<any>('/api/v1/attendance/scan', { method: 'POST', body: JSON.stringify({ staffId }) }),
  getHistory: (staffId: string, skip: number = 0, limit: number = 20) => handleApiCall<{ data: Types.AttendanceLog[], total: number }>(`/api/v1/attendance/${staffId}/history?skip=${skip}&limit=${limit}`)
};

export const production = {
  list: () => handleApiCall<Types.Production[]>('/api/v1/production'),
  create: (data: Omit<Types.Production, 'id'>) => handleApiCall<Types.Production>('/api/v1/production', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Types.Production>) => handleApiCall<Types.Production>(`/api/v1/production/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => handleApiCall<any>(`/api/v1/production/${id}`, { method: 'DELETE' })
};

export const ceo = {
  getSnapshot: () => handleApiCall<any>('/api/v1/ceo/snapshot')
};
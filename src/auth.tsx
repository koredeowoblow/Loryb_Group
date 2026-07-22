import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { parseJwt } from './lib/jwt'

export type Role = 'CEO' | 'Admin' | 'Security' | 'Warehouse' | 'Logistics' | 'Finance'

interface AuthContextType {
  role: Role | null
  setRole: (role: Role | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)



export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const token = localStorage.getItem('loryb_token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.role) {
        // Check if token is expired (exp is in seconds)
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('loryb_token');
          return null;
        }
        return decoded.role as Role;
      }
      localStorage.removeItem('loryb_token');
    }
    return null;
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      setRole(null)
    }
    window.addEventListener('loryb_unauthorized', handleUnauthorized)
    return () => window.removeEventListener('loryb_unauthorized', handleUnauthorized)
  }, [])

  const logout = () => {
    localStorage.removeItem('loryb_token')
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

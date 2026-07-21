import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Role = 'CEO' | 'Admin' | 'Security' | 'Warehouse' | 'Logistics' | 'Finance'

interface AuthContextType {
  role: Role | null
  setRole: (role: Role | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const token = localStorage.getItem('loryb_token')
    if (token) {
      const decoded = parseJwt(token)
      if (decoded && decoded.role) {
        return decoded.role as Role
      }
      localStorage.removeItem('loryb_token')
    }
    return null
  })

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

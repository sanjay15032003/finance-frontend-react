import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCredentials, logout as logoutAction, selectIsAuthenticated } from '../store/slices/authSlice'

interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const login = (token: string) => {
    dispatch(setCredentials({ token }))
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


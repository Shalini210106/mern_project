import { createContext, useState } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      return data
    } finally { setLoading(false) }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', formData)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      return data
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const merged = { ...user, ...updates }
    localStorage.setItem('user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

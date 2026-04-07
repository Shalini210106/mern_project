import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from './AuthContext'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useContext(AuthContext)

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch (e) {}
  }

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`)
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllRead = async () => {
    await api.put('/notifications/read-all')
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // poll every 30s
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

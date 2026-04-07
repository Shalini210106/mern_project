import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { NotificationContext } from '../../context/NotificationContext'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext)
  const { notifications, unreadCount, markRead, markAllRead } = useContext(NotificationContext)
  const [showNotifs, setShowNotifs] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700 text-xl">☰</button>
        <span className="font-bold text-indigo-700 text-lg">🎓 SkillTrack</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="font-semibold text-sm text-gray-700">Notifications</h3>
                <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
              </div>
              {notifications.length === 0
                ? <p className="text-center text-gray-400 text-sm py-6">No notifications</p>
                : notifications.map(n => (
                  <div key={n._id} onClick={() => markRead(n._id)}
                    className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-indigo-50' : ''}`}>
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition px-2">
          Logout
        </button>
      </div>
    </header>
  )
}

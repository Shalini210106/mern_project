import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const studentNav = [
  { to: '/student',               label: 'Dashboard',    icon: '🏠' },
  { to: '/student/skills',        label: 'My Skills',    icon: '🎯' },
  { to: '/student/certificates',  label: 'Certificates', icon: '📜' },
  { to: '/student/competitions',  label: 'Competitions', icon: '🏆' },
  { to: '/student/feedback',      label: 'Feedback',     icon: '💬' },
  { to: '/student/resources',     label: 'Resources',    icon: '📚' },
  { to: '/student/leaderboard',   label: 'Leaderboard',  icon: '🥇' },
  { to: '/student/profile',       label: 'Profile',      icon: '👤' },
]

const facultyNav = [
  { to: '/faculty',               label: 'Dashboard',    icon: '🏠' },
  { to: '/faculty/students',      label: 'Students',     icon: '👥' },
  { to: '/faculty/verify',        label: 'Verify Skills', icon: '✅' },
  { to: '/faculty/feedback',      label: 'Give Feedback', icon: '💬' },
  { to: '/faculty/resources',     label: 'Resources',    icon: '📚' },
  { to: '/faculty/analytics',     label: 'Analytics',    icon: '📊' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext)
  const navItems = user?.role === 'faculty' ? facultyNav : studentNav

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-700">
          <p className="font-bold text-lg">🎓 SkillTrack</p>
          <p className="text-gray-400 text-xs mt-1 capitalize">{user?.role} Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/student' || item.to === '/faculty'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          {user?.department}
        </div>
      </aside>
    </>
  )
}

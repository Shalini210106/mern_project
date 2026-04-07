import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

const medalEmoji = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
  const { user } = useContext(AuthContext)
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [dept, setDept] = useState('')

  const fetch = async () => {
    setLoading(true)
    const { data } = await api.get(`/leaderboard${dept ? `?department=${dept}` : ''}`)
    setLeaders(data)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [dept])

  const myRank = leaders.find(l => l._id === user?._id)

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Leaderboard 🥇">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input value={dept} onChange={e => setDept(e.target.value)} placeholder="Filter by department..." className="input-field max-w-xs" />
        {myRank && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm">
            Your Rank: <span className="font-bold text-indigo-700">#{myRank.rank}</span> with <span className="font-bold">{myRank.verifiedCount}</span> verified skills
          </div>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Rank</th>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Department</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Roll No.</th>
              <th className="px-4 py-3 text-center font-medium">Verified Skills</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map(l => (
              <tr key={l._id} className={`border-b hover:bg-gray-50 transition ${l._id === user?._id ? 'bg-indigo-50 font-semibold' : ''}`}>
                <td className="px-4 py-3">
                  <span className="font-bold">{medalEmoji[l.rank] || `#${l.rank}`}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {l.name?.charAt(0)}
                    </div>
                    <span>{l.name}</span>
                    {l._id === user?._id && <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">You</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{l.department}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{l.rollNumber}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">{l.verifiedCount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaders.length === 0 && <p className="text-center text-gray-400 py-8">No data yet</p>}
      </div>
    </PageLayout>
  )
}

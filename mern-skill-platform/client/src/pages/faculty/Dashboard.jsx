import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

export default function FacultyDashboard() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/resources/analytics'),
      api.get('/verify'),
    ]).then(([a, v]) => {
      setStats(a.data.summary)
      setPending(v.data.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title={`Faculty Dashboard — Welcome, ${user?.name}! 👨‍🏫`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Students"   value={stats?.totalStudents || 0}  color="indigo" />
        <StatCard icon="🎯" label="Total Skills"     value={stats?.totalSkills || 0}    color="sky"    />
        <StatCard icon="✅" label="Verified Skills"  value={stats?.verifiedSkills || 0} color="green"  />
        <StatCard icon="⏳" label="Pending Review"   value={stats?.pendingSkills || 0}  color="yellow" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Pending Skill Verifications</h3>
          <button onClick={() => navigate('/faculty/verify')} className="text-sm text-indigo-600 hover:underline">View all →</button>
        </div>
        {pending.length === 0
          ? <p className="text-gray-400 text-sm text-center py-6">No pending verifications 🎉</p>
          : <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium hidden md:table-cell">Department</th>
                <th className="pb-2 font-medium">Skill</th>
                <th className="pb-2 font-medium">Level</th>
                <th className="pb-2 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {pending.map(s => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{s.studentId?.name}</td>
                    <td className="py-2 text-gray-500 hidden md:table-cell">{s.studentId?.department}</td>
                    <td className="py-2 font-medium">{s.name}</td>
                    <td className="py-2 text-gray-500">{s.level}</td>
                    <td className="py-2"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </PageLayout>
  )
}

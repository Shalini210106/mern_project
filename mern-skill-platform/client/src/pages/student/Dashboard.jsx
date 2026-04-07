import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PageLayout from '../../components/layout/PageLayout'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

export default function StudentDashboard() {
  const { user } = useContext(AuthContext)
  const [skills, setSkills] = useState([])
  const [certs, setCerts] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/skills'),
      api.get('/certificates'),
      api.get('/feedback'),
    ]).then(([s, c, f]) => {
      setSkills(s.data); setCerts(c.data); setFeedback(f.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const verified = skills.filter(s => s.status === 'Verified').length
  const pending  = skills.filter(s => s.status === 'Pending').length

  return (
    <PageLayout title={`Welcome, ${user?.name}! 👋`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🎯" label="Total Skills"    value={skills.length}   color="indigo" />
        <StatCard icon="✅" label="Verified Skills" value={verified}        color="green"  />
        <StatCard icon="⏳" label="Pending Review"  value={pending}         color="yellow" />
        <StatCard icon="📜" label="Certificates"    value={certs.length}    color="sky"    />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Skills */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Skills</h3>
          {skills.length === 0
            ? <p className="text-gray-400 text-sm text-center py-4">No skills added yet</p>
            : <div className="space-y-3">
                {skills.slice(0, 5).map(s => (
                  <div key={s._id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-700 text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.category} · {s.level}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Recent Feedback */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Faculty Feedback</h3>
          {feedback.length === 0
            ? <p className="text-gray-400 text-sm text-center py-4">No feedback yet</p>
            : <div className="space-y-3">
                {feedback.slice(0, 4).map(f => (
                  <div key={f._id} className={`p-3 rounded-lg text-sm ${!f.isRead ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-700">{f.facultyId?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{f.message}</p>
                    {f.skillId && <p className="text-xs text-indigo-500 mt-1">Re: {f.skillId?.name}</p>}
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </PageLayout>
  )
}

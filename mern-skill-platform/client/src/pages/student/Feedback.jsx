import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'

export default function StudentFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/feedback').then(r => setFeedbacks(r.data)).finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    await api.put(`/feedback/${id}/read`)
    setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, isRead: true } : f))
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Faculty Feedback 💬">
      {feedbacks.length === 0
        ? <EmptyState icon="💬" title="No Feedback Yet" message="Faculty feedback will appear here" />
        : <div className="space-y-4 max-w-3xl">
            {feedbacks.map(f => (
              <div key={f._id} className={`card border-l-4 ${!f.isRead ? 'border-l-indigo-500 bg-indigo-50' : 'border-l-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {f.facultyId?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{f.facultyId?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {!f.isRead && (
                    <button onClick={() => markRead(f._id)} className="text-xs text-indigo-600 hover:underline">Mark read</button>
                  )}
                </div>
                {f.skillId && (
                  <div className="mt-2 text-xs bg-indigo-100 text-indigo-700 inline-block px-2 py-1 rounded-full">
                    Re: {f.skillId?.name}
                  </div>
                )}
                <p className="mt-3 text-gray-700">{f.message}</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${f.type === 'improvement' ? 'bg-orange-100 text-orange-700' : f.type === 'skill' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {f.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
      }
    </PageLayout>
  )
}

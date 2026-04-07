import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'

export default function StudentResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      api.get(`/resources?search=${search}`).then(r => setResources(r.data)).finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Learning Resources 📚">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." className="input-field max-w-md mb-6" />
      {resources.length === 0
        ? <EmptyState icon="📚" title="No Resources" message="Faculty will post learning resources here" />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(r => (
              <div key={r._id} className="card hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{r.category}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mt-2">{r.title}</h3>
                {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skillTags?.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>)}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-400">by {r.facultyId?.name}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs btn-primary py-1 px-3">Open →</a>
                </div>
              </div>
            ))}
          </div>
      }
    </PageLayout>
  )
}

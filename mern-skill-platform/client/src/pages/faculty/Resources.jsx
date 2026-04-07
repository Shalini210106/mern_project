import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function FacultyResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', url: '', category: '', skillTags: '' })

  useEffect(() => { api.get('/resources').then(r => setResources(r.data)).finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/resources', { ...form, skillTags: form.skillTags.split(',').map(t => t.trim()).filter(Boolean) })
      setResources(prev => [data, ...prev])
      toast.success('Resource added!')
      setShowModal(false); setForm({ title: '', description: '', url: '', category: '', skillTags: '' })
    } catch { toast.error('Error') }
  }

  const handleDelete = async (id) => {
    await api.delete(`/resources/${id}`)
    setResources(prev => prev.filter(r => r._id !== id))
    toast.success('Removed')
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Learning Resources 📚">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Resource</button>
      </div>
      {resources.length === 0
        ? <EmptyState icon="📚" title="No Resources" message="Post learning resources for students" />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(r => (
              <div key={r._id} className="card hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{r.category}</span>
                  <button onClick={() => handleDelete(r._id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                </div>
                <h3 className="font-semibold text-gray-800 mt-2">{r.title}</h3>
                {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.skillTags?.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>)}
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs text-indigo-600 hover:underline">Open Link →</a>
              </div>
            ))}
          </div>
      }
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Learning Resource">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['title','Title','text','e.g. React Documentation'],['url','URL','url','https://...'],['category','Category','text','e.g. Web Development']].map(([k,l,t,p]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input required={k!=='category'} type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="input-field" placeholder={p} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Tags <span className="text-gray-400">(comma separated)</span></label>
            <input value={form.skillTags} onChange={e => setForm({ ...form, skillTags: e.target.value })} className="input-field" placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Add Resource</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

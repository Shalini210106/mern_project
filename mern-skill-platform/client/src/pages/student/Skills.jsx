import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Programming', 'Web Development', 'Data Science', 'Design', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Other']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function StudentSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editSkill, setEditSkill] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', level: 'Beginner', description: '' })
  const [filter, setFilter] = useState('')

  const fetchSkills = async () => {
    const { data } = await api.get('/skills')
    setSkills(data)
    setLoading(false)
  }

  useEffect(() => { fetchSkills() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editSkill) {
        const { data } = await api.put(`/skills/${editSkill._id}`, form)
        setSkills(prev => prev.map(s => s._id === editSkill._id ? data : s))
        toast.success('Skill updated!')
      } else {
        const { data } = await api.post('/skills', form)
        setSkills(prev => [...prev, data])
        toast.success('Skill added! Pending faculty verification.')
      }
      setShowModal(false); setForm({ name: '', category: '', level: 'Beginner', description: '' }); setEditSkill(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    await api.delete(`/skills/${id}`)
    setSkills(prev => prev.filter(s => s._id !== id))
    toast.success('Skill removed')
  }

  const openEdit = (skill) => {
    setEditSkill(skill); setForm({ name: skill.name, category: skill.category, level: skill.level, description: skill.description }); setShowModal(true)
  }

  const filtered = skills.filter(s => !filter || s.category === filter)

  const statusColor = { Verified: 'border-l-emerald-500', Rejected: 'border-l-red-500', Pending: 'border-l-yellow-500', 'Needs Improvement': 'border-l-orange-500' }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="My Skills 🎯">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field max-w-xs">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => { setEditSkill(null); setForm({ name: '', category: '', level: 'Beginner', description: '' }); setShowModal(true) }} className="btn-primary">+ Add Skill</button>
      </div>

      {filtered.length === 0
        ? <EmptyState icon="🎯" title="No Skills Yet" message="Add your first skill to get started!" action={<button onClick={() => setShowModal(true)} className="btn-primary">Add Skill</button>} />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <div key={s._id} className={`card border-l-4 ${statusColor[s.status] || 'border-l-gray-300'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{s.name}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-xs text-gray-400 mb-1">{s.category} · {s.level}</p>
                {s.description && <p className="text-sm text-gray-600 mb-3">{s.description}</p>}
                {s.feedback && <div className="bg-orange-50 rounded-lg p-2 text-xs text-orange-700 mb-3">💬 {s.feedback}</div>}
                {s.verifiedBy && <p className="text-xs text-gray-400">Reviewed by: {s.verifiedBy?.name}</p>}
                <div className="flex gap-2 mt-3">
                  {s.status === 'Pending' && <button onClick={() => openEdit(s)} className="text-xs btn-outline py-1 px-3">Edit</button>}
                  <button onClick={() => handleDelete(s._id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
      }

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSkill ? 'Edit Skill' : 'Add New Skill'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. React.js" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} placeholder="Brief description..." />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{editSkill ? 'Update' : 'Add Skill'}</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'
import toast from 'react-hot-toast'

const LEVELS = ['College', 'State', 'National', 'International']
const levelColor = { College: 'bg-gray-100 text-gray-700', State: 'bg-blue-100 text-blue-700', National: 'bg-purple-100 text-purple-700', International: 'bg-yellow-100 text-yellow-700' }

export default function Competitions() {
  const [comps, setComps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', organizer: '', date: '', level: 'College', result: '', position: '' })

  useEffect(() => { api.get('/competitions').then(r => setComps(r.data)).finally(() => setLoading(false)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/competitions', form)
      setComps(prev => [data, ...prev])
      toast.success('Competition added!')
      setShowModal(false); setForm({ name: '', organizer: '', date: '', level: 'College', result: '', position: '' })
    } catch (err) { toast.error('Error adding competition') }
  }

  const handleDelete = async (id) => {
    await api.delete(`/competitions/${id}`)
    setComps(prev => prev.filter(c => c._id !== id))
    toast.success('Removed')
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Competitions 🏆">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Competition</button>
      </div>
      {comps.length === 0
        ? <EmptyState icon="🏆" title="No Competitions" message="Add competitions you've participated in!" />
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comps.map(c => (
              <div key={c._id} className="card hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{c.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColor[c.level]}`}>{c.level}</span>
                </div>
                {c.organizer && <p className="text-sm text-gray-500 mt-1">by {c.organizer}</p>}
                {c.date && <p className="text-xs text-gray-400 mt-1">📅 {new Date(c.date).toLocaleDateString()}</p>}
                <div className="flex gap-4 mt-3">
                  {c.result && <div className="text-sm"><span className="font-medium text-gray-600">Result:</span> {c.result}</div>}
                  {c.position && <div className="text-sm"><span className="font-medium text-gray-600">Position:</span> <span className="text-yellow-600 font-bold">{c.position}</span></div>}
                </div>
                <button onClick={() => handleDelete(c._id)} className="text-xs text-red-400 hover:text-red-600 mt-3">Remove</button>
              </div>
            ))}
          </div>
      }
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Competition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Competition Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Smart India Hackathon" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input-field">
                {LEVELS.map(l => <option key={l}>{l}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Position / Rank</label>
              <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="input-field" placeholder="e.g. 1st, Finalist" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
            <input value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} className="input-field" placeholder="e.g. Winner, Runner-up" /></div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Add</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

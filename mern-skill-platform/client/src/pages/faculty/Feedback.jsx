import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

export default function FacultyFeedback() {
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState('')
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ message: '', type: 'general', skillId: '' })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const toast_import = () => import('react-hot-toast').then(m => m.default)

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data.students)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selected) api.get(`/skills?studentId=${selected}`).then(r => setSkills(r.data))
  }, [selected])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSending(true)
    try {
      await api.post('/feedback', { studentId: selected, ...form })
      const toast = await toast_import()
      toast.success('Feedback sent!')
      setForm({ message: '', type: 'general', skillId: '' })
    } catch {
      const toast = await toast_import()
      toast.error('Failed')
    } finally { setSending(false) }
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Give Feedback 💬">
      <div className="max-w-xl">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
              <select required value={selected} onChange={e => setSelected(e.target.value)} className="input-field">
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.department})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="general">General</option>
                  <option value="skill">Skill-specific</option>
                  <option value="improvement">Improvement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Skill</label>
                <select value={form.skillId} onChange={e => setForm({ ...form, skillId: e.target.value })} className="input-field" disabled={!selected}>
                  <option value="">None</option>
                  {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field" rows={5} placeholder="Write constructive feedback for the student..." />
            </div>
            <button type="submit" disabled={sending || !selected} className="btn-primary w-full">
              {sending ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}

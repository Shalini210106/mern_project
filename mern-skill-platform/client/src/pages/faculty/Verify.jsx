import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function FacultyVerify() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ status: 'Verified', feedback: '' })
  const [tab, setTab] = useState('pending')

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const url = tab === 'pending' ? '/verify' : '/verify/history'
      const { data } = await api.get(url)
      setSkills(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchSkills() }, [tab])

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      await api.post('/verify', { skillId: selected._id, ...form })
      toast.success(`Skill marked as ${form.status}`)
      setSelected(null)
      fetchSkills()
    } catch { toast.error('Error') }
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="Skill Verification ✅">
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[['pending','Pending'], ['history','History']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${tab === k ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {skills.length === 0
        ? <EmptyState icon="✅" title={tab === 'pending' ? 'No Pending Skills' : 'No History'} message={tab === 'pending' ? 'All skills are reviewed!' : 'Verified skills will appear here'} />
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(s => (
              <div key={s._id} className="card hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{s.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{s.studentId?.name}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="text-xs text-gray-400 space-y-0.5">
                  <p>Category: {s.category} · {s.level}</p>
                  <p>Department: {s.studentId?.department}</p>
                  <p>Roll: {s.studentId?.rollNumber}</p>
                  {s.description && <p className="text-gray-500 mt-1">{s.description}</p>}
                </div>
                {tab === 'pending' && (
                  <button onClick={() => { setSelected(s); setForm({ status: 'Verified', feedback: '' }) }}
                    className="mt-3 btn-primary text-xs py-1.5 w-full">Review</button>
                )}
                {tab === 'history' && s.verifiedBy && (
                  <p className="text-xs text-gray-400 mt-2">Reviewed by {s.verifiedBy?.name}</p>
                )}
              </div>
            ))}
          </div>
      }

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Review: ${selected?.name}`}>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p><strong>Student:</strong> {selected?.studentId?.name}</p>
            <p><strong>Category:</strong> {selected?.category}</p>
            <p><strong>Level:</strong> {selected?.level}</p>
            {selected?.description && <p className="mt-1 text-gray-600">{selected.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
            <div className="grid grid-cols-3 gap-2">
              {['Verified', 'Needs Improvement', 'Rejected'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`py-2 text-xs rounded-lg border-2 font-medium transition ${form.status === s
                    ? s === 'Verified' ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : s === 'Rejected' ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-500'}`}>
                  {s === 'Verified' ? '✅' : s === 'Rejected' ? '❌' : '⚠️'} {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback / Comments</label>
            <textarea value={form.feedback} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))} className="input-field" rows={3} placeholder="Optional comments for the student..." />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setSelected(null)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Submit Review</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

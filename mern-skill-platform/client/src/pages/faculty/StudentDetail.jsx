import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function StudentDetail() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [skills, setSkills] = useState([])
  const [certs, setCerts] = useState([])
  const [comps, setComps] = useState([])
  const [gapData, setGapData] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({ message: '', type: 'general', skillId: '' })
  const [activeTab, setActiveTab] = useState('skills')

  useEffect(() => {
    Promise.all([
      api.get(`/students/${id}`),
      api.get(`/certificates?studentId=${id}`),
      api.get(`/competitions?studentId=${id}`),
      api.get(`/skills/gap/${id}`),
    ]).then(([s, c, comp, gap]) => {
      setStudent(s.data.student); setSkills(s.data.skills)
      setCerts(c.data); setComps(comp.data); setGapData(gap.data)
    }).finally(() => setLoading(false))
  }, [id])

  const sendFeedback = async (e) => {
    e.preventDefault()
    try {
      await api.post('/feedback', { studentId: id, ...feedbackForm })
      toast.success('Feedback sent!')
      setFeedbackModal(false); setFeedbackForm({ message: '', type: 'general', skillId: '' })
    } catch { toast.error('Failed to send') }
  }

  if (loading) return <LoadingSpinner />

  const tabs = [
    { key: 'skills', label: `Skills (${skills.length})` },
    { key: 'certs',  label: `Certificates (${certs.length})` },
    { key: 'comps',  label: `Competitions (${comps.length})` },
    { key: 'gap',    label: 'Skill Gap' },
  ]

  return (
    <PageLayout>
      <button onClick={() => navigate('/faculty/students')} className="text-sm text-indigo-600 hover:underline mb-4 block">← Back to Students</button>

      {/* Student Header */}
      <div className="card mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {student?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{student?.name}</h2>
            <p className="text-gray-500 text-sm">{student?.email}</p>
            <p className="text-xs text-gray-400">{student?.department} · {student?.rollNumber}</p>
          </div>
        </div>
        <button onClick={() => setFeedbackModal(true)} className="btn-primary">💬 Give Feedback</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px ${activeTab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(s => (
            <div key={s._id} className="card border-l-4 border-l-indigo-200">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{s.name}</h3>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{s.category} · {s.level}</p>
              {s.feedback && <p className="text-xs bg-orange-50 rounded p-2 mt-2 text-orange-700">{s.feedback}</p>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map(c => (
            <div key={c._id} className="card">
              <div className="flex justify-between"><h3 className="font-semibold">{c.title}</h3><StatusBadge status={c.status} /></div>
              <p className="text-sm text-gray-500 mt-1">by {c.issuedBy}</p>
              <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-2 block">View →</a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comps.map(c => (
            <div key={c._id} className="card">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-gray-500">{c.level} · {c.position}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'gap' && (
        <div className="space-y-4">
          {gapData.length === 0
            ? <p className="text-gray-400 text-center py-8">No skill gap data. Add required skills in the admin panel.</p>
            : gapData.map(g => (
              <div key={g.domain} className="card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">{g.domain}</h3>
                  <span className={`text-sm font-bold ${g.percentage >= 80 ? 'text-emerald-600' : g.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {g.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${g.percentage >= 80 ? 'bg-emerald-500' : g.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${g.percentage}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-emerald-600 font-medium mb-1">✅ Has ({g.present.length})</p>
                    {g.present.map(p => <span key={p} className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded mr-1 mb-1">{p}</span>)}
                  </div>
                  <div>
                    <p className="text-red-500 font-medium mb-1">❌ Missing ({g.missing.length})</p>
                    {g.missing.map(m => <span key={m} className="inline-block bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded mr-1 mb-1">{m}</span>)}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Feedback Modal */}
      <Modal isOpen={feedbackModal} onClose={() => setFeedbackModal(false)} title={`Feedback for ${student?.name}`}>
        <form onSubmit={sendFeedback} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={feedbackForm.type} onChange={e => setFeedbackForm({ ...feedbackForm, type: e.target.value })} className="input-field">
              <option value="general">General</option>
              <option value="skill">Skill-specific</option>
              <option value="improvement">Improvement Suggestion</option>
            </select>
          </div>
          {feedbackForm.type === 'skill' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Skill</label>
              <select value={feedbackForm.skillId} onChange={e => setFeedbackForm({ ...feedbackForm, skillId: e.target.value })} className="input-field">
                <option value="">None</option>
                {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea required value={feedbackForm.message} onChange={e => setFeedbackForm({ ...feedbackForm, message: e.target.value })} className="input-field" rows={4} placeholder="Write your feedback..." />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setFeedbackModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Send Feedback</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

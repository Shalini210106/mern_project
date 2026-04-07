import { useState, useEffect } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', issuedBy: '', issuedDate: '', skillId: '' })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/certificates'), api.get('/skills')])
      .then(([c, s]) => { setCerts(c.data); setSkills(s.data) })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please select a file')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('certificate', file)
      fd.append('title', form.title)
      fd.append('issuedBy', form.issuedBy)
      fd.append('issuedDate', form.issuedDate)
      if (form.skillId) fd.append('skillId', form.skillId)
      const { data } = await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setCerts(prev => [data, ...prev])
      toast.success('Certificate uploaded!')
      setShowModal(false); setForm({ title: '', issuedBy: '', issuedDate: '', skillId: '' }); setFile(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  if (loading) return <LoadingSpinner />
  return (
    <PageLayout title="My Certificates 📜">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Upload Certificate</button>
      </div>

      {certs.length === 0
        ? <EmptyState icon="📜" title="No Certificates" message="Upload your first certificate!" action={<button onClick={() => setShowModal(true)} className="btn-primary">Upload</button>} />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map(c => (
              <div key={c._id} className="card hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">📄</div>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Issued by: {c.issuedBy}</p>
                {c.issuedDate && <p className="text-xs text-gray-400 mt-1">{new Date(c.issuedDate).toLocaleDateString()}</p>}
                {c.skillId && <p className="text-xs text-indigo-500 mt-1">Skill: {c.skillId?.name}</p>}
                {c.reviewNote && <p className="text-xs bg-gray-50 rounded p-2 mt-2 text-gray-600">{c.reviewNote}</p>}
                <a href={c.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-indigo-600 hover:underline">
                  View Certificate →
                </a>
              </div>
            ))}
          </div>
      }

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Certificate">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. AWS Certified Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
            <input required value={form.issuedBy} onChange={e => setForm({ ...form, issuedBy: e.target.value })} className="input-field" placeholder="e.g. Amazon Web Services" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input type="date" value={form.issuedDate} onChange={e => setForm({ ...form, issuedDate: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Skill</label>
              <select value={form.skillId} onChange={e => setForm({ ...form, skillId: e.target.value })} className="input-field">
                <option value="">None</option>
                {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/Image)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={uploading} className="btn-primary">{uploading ? 'Uploading...' : 'Upload'}</button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

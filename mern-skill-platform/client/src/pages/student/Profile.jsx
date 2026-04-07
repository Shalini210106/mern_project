import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function StudentProfile() {
  const { user, updateUser } = useContext(AuthContext)
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', bio: user?.bio || '', password: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { name: form.name, department: form.department, bio: form.bio }
      if (form.password) payload.password = form.password
      const { data } = await api.put(`/students/${user._id}`, payload)
      updateUser(data); toast.success('Profile updated!')
      setForm(f => ({ ...f, password: '' }))
    } catch (err) { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <PageLayout title="My Profile 👤">
      <div className="max-w-xl">
        <div className="card mb-6 flex items-center gap-5">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">{user?.department} · {user?.rollNumber}</p>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name','Full Name','text'],['department','Department','text']].map(([k,l,t]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="input-field" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-gray-400">(leave blank to keep)</span></label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}

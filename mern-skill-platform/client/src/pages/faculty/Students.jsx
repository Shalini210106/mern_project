import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

export default function FacultyStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ name: '', department: '', skill: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) })
      const { data } = await api.get(`/students?${params}`)
      setStudents(data.students); setTotalPages(data.pages)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [filters, page])

  return (
    <PageLayout title="Students 👥">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[['name','Search by name...'],['department','Filter by department...'],['skill','Filter by skill...']].map(([k,p]) => (
          <input key={k} value={filters[k]} onChange={e => { setFilters(f => ({ ...f, [k]: e.target.value })); setPage(1) }}
            placeholder={p} className="input-field" />
        ))}
      </div>

      {loading ? <LoadingSpinner fullScreen={false} /> : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Roll No.</th>
                  <th className="px-4 py-3 font-medium text-center">Total Skills</th>
                  <th className="px-4 py-3 font-medium text-center">Verified</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{s.name?.charAt(0)}</div>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.department}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{s.rollNumber}</td>
                    <td className="px-4 py-3 text-center">{s.totalSkillCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">{s.verifiedSkillCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/faculty/students/${s._id}`)} className="text-xs btn-outline py-1 px-3">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && <p className="text-center text-gray-400 py-8">No students found</p>}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="btn-outline py-1.5 disabled:opacity-40">← Prev</button>
              <span className="text-sm text-gray-500 py-1.5">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="btn-outline py-1.5 disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}

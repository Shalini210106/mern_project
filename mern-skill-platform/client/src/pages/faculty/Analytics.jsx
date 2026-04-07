import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import PageLayout from '../../components/layout/PageLayout'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/resources/analytics').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  const { summary, topSkills, statusDist, deptDist } = data

  const statusChartData = {
    labels: statusDist.map(s => s._id),
    datasets: [{
      data: statusDist.map(s => s.count),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#F97316'],
      borderWidth: 0,
    }]
  }

  const topSkillsData = {
    labels: topSkills.map(s => s._id),
    datasets: [{
      label: 'Students with Skill',
      data: topSkills.map(s => s.count),
      backgroundColor: '#6366F1',
      borderRadius: 6,
    }]
  }

  const deptData = {
    labels: deptDist.map(d => d._id || 'Unknown'),
    datasets: [{
      label: 'Students',
      data: deptDist.map(d => d.count),
      backgroundColor: '#0EA5E9',
      borderRadius: 6,
    }]
  }

  return (
    <PageLayout title="Analytics Dashboard 📊">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Students"  value={summary.totalStudents}  color="indigo" />
        <StatCard icon="🎯" label="Total Skills"    value={summary.totalSkills}    color="sky"    />
        <StatCard icon="✅" label="Verified"        value={summary.verifiedSkills} color="green"  />
        <StatCard icon="⏳" label="Pending"         value={summary.pendingSkills}  color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Doughnut */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Skill Status Distribution</h3>
          <div className="max-w-xs mx-auto">
            <Doughnut data={statusChartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Top Skills Bar */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Top 10 Skills</h3>
          <Bar data={topSkillsData} options={{
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
          }} />
        </div>
      </div>

      {/* Department Distribution */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Students by Department</h3>
        <Bar data={deptData} options={{
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        }} />
      </div>
    </PageLayout>
  )
}

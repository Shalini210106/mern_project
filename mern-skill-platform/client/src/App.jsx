import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth Pages
const Login    = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

// Student Pages
const StudentDashboard    = lazy(() => import('./pages/student/Dashboard'))
const StudentSkills       = lazy(() => import('./pages/student/Skills'))
const StudentCerts        = lazy(() => import('./pages/student/Certificates'))
const StudentCompetitions = lazy(() => import('./pages/student/Competitions'))
const StudentLeaderboard  = lazy(() => import('./pages/student/Leaderboard'))
const StudentFeedback     = lazy(() => import('./pages/student/Feedback'))
const StudentProfile      = lazy(() => import('./pages/student/Profile'))
const StudentResources    = lazy(() => import('./pages/student/Resources'))

// Faculty Pages
const FacultyDashboard    = lazy(() => import('./pages/faculty/Dashboard'))
const FacultyStudents     = lazy(() => import('./pages/faculty/Students'))
const FacultyStudentDetail = lazy(() => import('./pages/faculty/StudentDetail'))
const FacultyVerify       = lazy(() => import('./pages/faculty/Verify'))
const FacultyAnalytics    = lazy(() => import('./pages/faculty/Analytics'))
const FacultyResources    = lazy(() => import('./pages/faculty/Resources'))
const FacultyFeedback     = lazy(() => import('./pages/faculty/Feedback'))

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />
  }
  return children
}

export default function App() {
  const { user } = useContext(AuthContext)
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student"              element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/skills"       element={<PrivateRoute role="student"><StudentSkills /></PrivateRoute>} />
          <Route path="/student/certificates" element={<PrivateRoute role="student"><StudentCerts /></PrivateRoute>} />
          <Route path="/student/competitions" element={<PrivateRoute role="student"><StudentCompetitions /></PrivateRoute>} />
          <Route path="/student/leaderboard"  element={<PrivateRoute role="student"><StudentLeaderboard /></PrivateRoute>} />
          <Route path="/student/feedback"     element={<PrivateRoute role="student"><StudentFeedback /></PrivateRoute>} />
          <Route path="/student/profile"      element={<PrivateRoute role="student"><StudentProfile /></PrivateRoute>} />
          <Route path="/student/resources"    element={<PrivateRoute role="student"><StudentResources /></PrivateRoute>} />

          {/* Faculty Routes */}
          <Route path="/faculty"              element={<PrivateRoute role="faculty"><FacultyDashboard /></PrivateRoute>} />
          <Route path="/faculty/students"     element={<PrivateRoute role="faculty"><FacultyStudents /></PrivateRoute>} />
          <Route path="/faculty/students/:id" element={<PrivateRoute role="faculty"><FacultyStudentDetail /></PrivateRoute>} />
          <Route path="/faculty/verify"       element={<PrivateRoute role="faculty"><FacultyVerify /></PrivateRoute>} />
          <Route path="/faculty/analytics"    element={<PrivateRoute role="faculty"><FacultyAnalytics /></PrivateRoute>} />
          <Route path="/faculty/resources"    element={<PrivateRoute role="faculty"><FacultyResources /></PrivateRoute>} />
          <Route path="/faculty/feedback"     element={<PrivateRoute role="faculty"><FacultyFeedback /></PrivateRoute>} />

          <Route path="/" element={
            user
              ? <Navigate to={user.role === 'faculty' ? '/faculty' : '/student'} replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

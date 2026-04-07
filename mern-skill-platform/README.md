# 🎓 Faculty Guided Student Skill Enhancement Platform

A full-stack MERN application where faculty guide students to track, verify, and improve their skills.

---

## 👥 User Roles

| Role    | Capabilities |
|---------|-------------|
| Student | Add skills, upload certificates, track progress, view feedback, leaderboard |
| Faculty | Verify skills, give feedback, view analytics, post resources, manage students |

---

## 🚀 Quick Start (Local with MongoDB Compass)

### Step 1 — Clone & Setup
```bash
git clone https://github.com/yourname/mern-skill-platform.git
cd mern-skill-platform
```

### Step 2 — Server Setup
```bash
cd server
copy .env.example .env      # Windows
# OR
cp .env.example .env        # Mac/Linux

# Edit .env — set:
# MONGO_URI=mongodb://localhost:27017/skill_platform
# JWT_SECRET=anysecretkey123

npm install
npm run dev                  # runs on http://localhost:5000
```

### Step 3 — Client Setup
```bash
cd client
copy .env.example .env
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev                  # runs on http://localhost:5173
```

### Step 4 — Run Both Together (from root)
```bash
npm install
npm run dev
```

---

## 🔧 Features

### Student Portal
- ✅ Register / Login
- 🎯 Add & manage skills (categories, levels)
- 📜 Upload certificates (Cloudinary)
- 🏆 Track competition participation
- 💬 View faculty feedback & notifications
- 📊 Skill gap analysis
- 🥇 Leaderboard (ranked by verified skills)
- 📚 Browse faculty-posted resources

### Faculty Portal
- 👥 View & filter all students
- ✅ Verify skills (Verified / Rejected / Needs Improvement)
- 📊 Analytics dashboard with charts
- 💬 Send feedback to students
- 📚 Post learning resources
- 🔍 Skill gap analysis per student

---

## 🔑 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/students | Faculty | List all students |
| GET | /api/students/:id | Protected | Student detail |
| POST | /api/skills | Student | Add skill |
| GET | /api/skills | Protected | Get skills |
| GET | /api/skills/gap/:id | Protected | Skill gap analysis |
| POST | /api/certificates | Student | Upload certificate |
| PUT | /api/certificates/:id/review | Faculty | Approve/reject cert |
| POST | /api/verify | Faculty | Verify skill |
| GET | /api/verify | Faculty | Pending verifications |
| POST | /api/feedback | Faculty | Send feedback |
| GET | /api/notifications | Protected | Get notifications |
| GET | /api/leaderboard | Protected | Leaderboard |
| GET | /api/resources/analytics | Faculty | Analytics data |

---

## 🗂️ Project Structure

```
mern-skill-platform/
├── server/
│   ├── config/         db.js, cloudinary.js
│   ├── controllers/    auth, student, skill, verify, cert, comp, feedback, notification, leaderboard, resource
│   ├── middleware/     authMiddleware, errorMiddleware
│   ├── models/         User, Skill, Certificate, Competition, Feedback, Notification, Resource, SkillGap
│   ├── routes/         All API routes
│   └── server.js
│
└── client/
    └── src/
        ├── components/
        │   ├── common/     LoadingSpinner, Modal, StatusBadge, StatCard, EmptyState
        │   └── layout/     Navbar, Sidebar, PageLayout
        ├── context/        AuthContext, NotificationContext
        ├── pages/
        │   ├── student/    Dashboard, Skills, Certificates, Competitions, Leaderboard, Feedback, Resources, Profile
        │   └── faculty/    Dashboard, Students, StudentDetail, Verify, Analytics, Resources, Feedback
        ├── services/       api.js (Axios)
        └── App.jsx
```

---

## 🛡️ Seed Default Skill Gaps

After running the server, use MongoDB Compass to insert this into the `skillgaps` collection:

```json
{
  "domain": "Web Development",
  "requiredSkills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"]
}
```

---

## 🌐 Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

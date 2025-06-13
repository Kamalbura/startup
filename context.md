# CampusKarma - Project Context & Evolution

## 🎯 Mission Statement
Building India's trust-first student skill economy platform where college students can earn, collaborate, and build verified reputation through peer-to-peer gig marketplace.

## 🧬 Core DNA
- **Trust-First**: .edu verification, UPI escrow, karma scoring
- **Student-Centric**: Gen Z UI/UX, campus filters, micro-entrepreneurship
- **Verified Skills**: Quiz-based skill validation, anti-cheat mechanisms
- **Transparent Payments**: Escrow system, fair dispute resolution

## 📋 Development Sprint Log

### Sprint 1 - Foundation Setup ✅ COMPLETED
**Status**: ✅ COMPLETE
**Goal**: Project scaffolding, directory structure, context establishment

**Components Created**:
- ✅ Project directory structure (frontend/backend separation)
- ✅ Frontend scaffolding (React + Vite + TailwindCSS + Anime.js)
- ✅ Backend scaffolding (Node.js + Express + MongoDB + Socket.io)
- ✅ Core configuration files (package.json, tailwind.config.js, vite.config.js)
- ✅ Initial component architecture (Landing, Auth, Dashboard pages)
- ✅ Context providers (AuthContext, SocketContext)
- ✅ Brand colors and design system (karma, trust, campus themes)

**Context Notes**:
- Following Agile methodology with step-by-step iterations
- Each module must be self-explanatory and robust
- UI/UX must resonate with Gen Z college students (dopamine-friendly animations)
- Code maintainability is paramount for team scalability
- Magic link auth flow implemented with .edu validation
- Socket.io real-time infrastructure ready for bidding/messaging

### Sprint 2 - Backend Core & Authentication ✅ FOUNDATION COMPLETE
**Status**: ✅ SOLID FOUNDATION - READY FOR API ROUTES
**Goal**: Complete backend infrastructure, database models, auth endpoints

**Components Built** ✅:
- ✅ Database connection with MongoDB (production-ready with retry logic)
- ✅ User Model (trust scoring, skill verification, anti-fraud protection)
- ✅ Task Model (bidding system, escrow integration, completion tracking)
- ✅ Review Model (trust building, verification, helpfulness voting)
- ✅ Skill Model (quiz generation, verification algorithms)
- ✅ Authentication Service (JWT, magic links, .edu validation)
- ✅ Auth Middleware (token verification, role checking, activity tracking)
- ✅ Express Server (security, CORS, rate limiting, Socket.IO)
- ✅ Environment configuration (.env setup for all services)
- ✅ Backend server tested and running (health endpoints working)
- ✅ MongoDB schema validation (minor index optimizations pending)

### Sprint 3 - API Routes Implementation 🔄 IN PROGRESS
**Status**: � READY TO BUILD
**Goal**: Implement core API endpoints for authentication, users, tasks, and skills

**Target Components**:
- [ ] Authentication Routes (`/api/v1/auth`) - magic link flow, token verification, .edu validation
- [ ] User Routes (`/api/v1/users`) - profile management, skill verification, karma system
- [ ] Task Routes (`/api/v1/tasks`) - CRUD operations, bidding system, escrow management
- [ ] Skill Routes (`/api/v1/skills`) - quiz generation, verification algorithms
- [ ] Real-time Socket.IO features - messaging, notifications, live bidding
- [ ] MongoDB optimization - fix duplicate index warnings, performance tuning

**Implementation Priority**:
1. **Auth Routes** (foundation for all other features)
2. **User Routes** (profile and skill management)
3. **Task Routes** (core business logic)
4. **Skill Routes** (verification system)
5. **Real-time Features** (enhanced UX)

**Context Notes**:
- MongoDB schemas must be flexible for rapid iteration
- Auth system needs bulletproof security (.edu validation is critical)
- All endpoints require proper validation & error handling
- Trust engine algorithms lay foundation for platform integrity

## 🎨 UI/UX Philosophy
- **Clean & Modern**: TailwindCSS with custom components
- **Animated Interactions**: Anime.js for dopamine-friendly UX
- **Trust Indicators**: Visual karma bars, verification badges, escrow status
- **Mobile-First**: Responsive design for campus mobility
- **Gen Z Appeal**: Smooth transitions, emoji reactions, gamification elements

## 🔧 Tech Stack Decisions
- **Frontend**: React.js (component reusability) + Vite (fast dev) + TailwindCSS (utility-first styling)
- **Backend**: Node.js + Express (familiar ecosystem) + MongoDB (flexible schemas)
- **Real-time**: Socket.io (bidding, messaging, notifications)
- **Auth**: Magic links + JWT (secure, scalable, .edu enforcement)
- **Payments**: Razorpay Route (UPI escrow capability)
- **Deployment**: Vercel (frontend) + Railway/Fly.io (backend)

## 📊 Data Models (Evolving)
```javascript
// Core entities that drive the platform
User: { 
  name, email, college, karmaScore, skills, reviews, verified,
  createdAt, lastActive, profileImage, bio, socialLinks
}

Task: { 
  title, description, budget, assignedTo, postedBy, deadline, status,
  skillsRequired, bids, attachments, createdAt, completedAt
}

Skill: { 
  name, category, quizResults, verified, level, attempts,
  lastAttempt, verificationDate
}

Review: { 
  stars, comment, taskId, reviewerId, reviewedUserId, createdAt,
  helpful, verified
}

Dispute: { 
  taskId, complainant, defendant, reason, resolution, status,
  createdAt, resolvedAt, assignedModerator
}
```

## 🎯 Success Metrics
- User trust (karma scores >70, review quality >4.0)
- Transaction completion rate >90%
- Skill verification accuracy >95%
- Platform engagement (daily active users, task completion time)
- Payment disputes <5%

## 🚦 Current Development Status
- ✅ Frontend scaffolding with clean UI components
- ✅ TailwindCSS design system with brand colors
- ✅ React routing and context providers
- ✅ Anime.js integration for smooth UX
- 🔄 Backend infrastructure in progress
- ❌ Database models pending
- ❌ Authentication endpoints pending
- ❌ Real-time features pending

---
*This context file evolves with every sprint. Each feature addition updates this living document.*

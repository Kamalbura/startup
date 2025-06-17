# SkillLance Database Migration Plan

## Phase 1: Add PostgreSQL (Keep Current Setup)

### Install Dependencies
```bash
npm install pg pg-hstore sequelize redis ioredis
npm install --save-dev @types/pg
```

### New Database Schema (PostgreSQL)
```sql
-- Core anonymous help system
CREATE TABLE anonymous_help_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_tags TEXT[] NOT NULL,
    urgency_level INTEGER DEFAULT 1,
    college_domain VARCHAR(100),
    anonymous_avatar VARCHAR(50),
    encrypted_request TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_expires_skills (expires_at, skill_tags),
    INDEX idx_college_urgency (college_domain, urgency_level)
);

-- Trust network (privacy-preserving)
CREATE TABLE trust_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    helper_hash VARCHAR(64), -- Hashed user ID
    seeker_hash VARCHAR(64), -- Hashed user ID
    session_quality INTEGER, -- 1-10 rating
    help_duration INTEGER, -- minutes
    skill_category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_trust_lookup (helper_hash, created_at)
);

-- Skill verification (decentralized)
CREATE TABLE skill_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_hash VARCHAR(64),
    skill_name VARCHAR(100),
    verification_type VARCHAR(50), -- 'peer', 'quiz', 'project'
    score INTEGER,
    verified_by_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Update
```env
# Add to .env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=skilllance
POSTGRES_USER=skilllance_user
POSTGRES_PASSWORD=your_secure_password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional_password
```

## Phase 2: Implement Anonymous System

### Anonymous Request Handler
```javascript
// backend/services/anonymousHelpService.js
import Redis from 'ioredis';
import { Pool } from 'pg';

class AnonymousHelpService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.pg = new Pool({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  async createAnonymousRequest(request) {
    const sessionId = crypto.randomUUID();
    const avatar = this.generateAnonymousAvatar();
    
    // Store in PostgreSQL for persistence
    await this.pg.query(`
      INSERT INTO anonymous_help_sessions 
      (id, skill_tags, urgency_level, college_domain, anonymous_avatar, encrypted_request, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      sessionId,
      request.skills,
      request.urgency,
      request.collegeDomain,
      avatar,
      request.encryptedContent,
      new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiry
    ]);

    // Add to real-time feed (Redis)
    await this.redis.zadd('live_help_feed', Date.now(), JSON.stringify({
      id: sessionId,
      skills: request.skills,
      urgency: request.urgency,
      avatar: avatar,
      college: request.collegeDomain
    }));

    return { sessionId, avatar };
  }

  generateAnonymousAvatar() {
    const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
    const shapes = ['circle', 'triangle', 'square', 'diamond', 'star'];
    return `${colors[Math.floor(Math.random() * colors.length)]}-${shapes[Math.floor(Math.random() * shapes.length)]}`;
  }
}
```

## Phase 3: Trust System Implementation

### Privacy-Preserving Trust
```javascript
// backend/services/trustService.js
import crypto from 'crypto';

class TrustService {
  // Hash user IDs for privacy
  hashUserId(userId) {
    return crypto.createHash('sha256')
      .update(userId + process.env.TRUST_SALT)
      .digest('hex');
  }

  async recordTrustInteraction(helperId, seekerId, quality, duration, skillCategory) {
    const helperHash = this.hashUserId(helperId);
    const seekerHash = this.hashUserId(seekerId);

    await this.pg.query(`
      INSERT INTO trust_interactions 
      (helper_hash, seeker_hash, session_quality, help_duration, skill_category)
      VALUES ($1, $2, $3, $4, $5)
    `, [helperHash, seekerHash, quality, duration, skillCategory]);

    // Update cached trust score
    const newScore = await this.calculateTrustScore(helperHash);
    await this.redis.setex(`trust_score:${helperHash}`, 3600, newScore);
  }

  async calculateTrustScore(userHash) {
    const result = await this.pg.query(`
      SELECT 
        AVG(session_quality) as avg_quality,
        COUNT(*) as total_sessions,
        AVG(help_duration) as avg_duration
      FROM trust_interactions 
      WHERE helper_hash = $1 
      AND created_at > NOW() - INTERVAL '3 months'
    `, [userHash]);

    const { avg_quality, total_sessions, avg_duration } = result.rows[0];
    
    // Trust algorithm: quality (60%) + consistency (25%) + time investment (15%)
    const qualityScore = (avg_quality / 10) * 60;
    const consistencyScore = Math.min(total_sessions * 2, 25);
    const timeScore = Math.min((avg_duration / 30) * 15, 15);
    
    return Math.round(qualityScore + consistencyScore + timeScore);
  }
}
```

## Benefits of This Architecture

### ✅ Privacy & Security
- **Data Minimization**: Only store what's necessary
- **Anonymous Sessions**: No persistent identity required
- **Hash-based Trust**: User privacy preserved
- **Client-side Encryption**: Keys never leave browser

### ✅ Performance & Scalability  
- **Redis**: Sub-millisecond real-time operations
- **PostgreSQL**: Complex queries for matching algorithms
- **IndexedDB**: Offline support and fast local access
- **Horizontal Scaling**: Each component scales independently

### ✅ Developer Experience
- **SQL**: Complex trust algorithms with joins
- **ACID Transactions**: Data consistency for payments
- **Redis Pub/Sub**: Real-time features
- **Rich Ecosystem**: Extensive tooling and libraries

### ✅ Cost Efficiency
- **PostgreSQL**: More cost-effective than MongoDB for complex queries
- **Redis**: Extremely efficient for caching and real-time features
- **No Vendor Lock-in**: Can migrate between providers easily

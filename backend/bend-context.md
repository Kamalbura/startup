# SkillLance Backend - Complete Guide & Architecture

## 🎯 Overview

This document provides a comprehensive guide to the SkillLance backend architecture, designed to teach Node.js backend development concepts using our real-world implementation. The backend follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Request Flow Walkthrough](#request-flow-walkthrough)
4. [Authentication System](#authentication-system)
5. [Database Integration](#database-integration)
6. [API Documentation](#api-documentation)
7. [Error Handling](#error-handling)
8. [Security Features](#security-features)
9. [Development Guide](#development-guide)
10. [Learning Objectives](#learning-objectives)

---

## 🏗️ Architecture Overview

### Design Principles

- **Clean Architecture**: Separation of concerns with clear boundaries
- **Domain-Driven Design**: Business logic at the core
- **SOLID Principles**: Maintainable and testable code
- **Dependency Injection**: Loose coupling between components

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Layer (Express)                     │
├─────────────────────────────────────────────────────────────┤
│                   Controllers Layer                         │
│              (HTTP Request/Response Handling)               │
├─────────────────────────────────────────────────────────────┤
│                    Services Layer                           │
│                 (Business Logic)                            │
├─────────────────────────────────────────────────────────────┤
│                  Repositories Layer                         │
│                (Data Access Logic)                          │
├─────────────────────────────────────────────────────────────┤
│                   Database Layer                            │
│                   (MongoDB)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
backend/
├── app.js                      # Modern entry point
├── server.js                   # Legacy entry point
├── src/                        # 🆕 Modern Architecture
│   ├── server.js               # Main server class
│   ├── controllers/            # HTTP request handlers
│   │   ├── BaseController.js   # Base controller with common methods
│   │   └── AnonymousRequestController.js
│   ├── services/               # Business logic layer
│   │   ├── BaseService.js      # Base service with common operations
│   │   └── AnonymousRequestService.js
│   ├── repositories/           # Data access layer
│   │   ├── BaseRepository.js   # Base repository with CRUD operations
│   │   └── AnonymousRequestRepository.js
│   ├── routes/                 # Route definitions
│   │   └── anonymousRequests.js
│   ├── validators/             # Input validation schemas
│   │   ├── index.js            # Validator exports
│   │   ├── AnonymousRequestSchemas.js
│   │   └── CommonSchemas.js
│   ├── errors/                 # Error handling
│   │   ├── index.js            # Error exports
│   │   ├── AppError.js         # Base error class
│   │   ├── ValidationError.js  # Validation errors
│   │   └── errorHandler.js     # Global error handler
│   ├── utils/                  # Utility functions
│   │   ├── response.js         # Response helpers
│   │   └── logger.js           # Logging utilities
│   └── types/                  # Type definitions
├── config/                     # Configuration files
│   ├── database.js             # MongoDB connection
│   └── firebase.js             # Firebase configuration
├── middleware/                 # Express middleware
│   └── auth.js                 # Authentication middleware
├── models/                     # Legacy Mongoose models
├── routes/                     # 🔄 Legacy routes (to be migrated)
├── utils/                      # Legacy utilities
├── dump/                       # 🗑️ Archived/test files
└── tests/                      # Test files
```

### Key Differences: Modern vs Legacy

| Aspect | Modern (`src/`) | Legacy (`root/`) |
|--------|----------------|------------------|
| **Architecture** | Clean Architecture | Monolithic |
| **Organization** | Layered (Controllers/Services/Repositories) | Mixed concerns |
| **Error Handling** | Centralized with custom error classes | Scattered try/catch |
| **Validation** | Joi schemas with middleware | Basic validation |
| **Responses** | Standardized response format | Inconsistent |
| **Testing** | Testable with dependency injection | Hard to test |

---

## 🔄 Request Flow Walkthrough

Let's trace how an API request flows through our system:

### Example: Creating an Anonymous Request

**Step 1: HTTP Request Arrives**
```
POST /api/v1/anonymous/request
Content-Type: application/json
Authorization: Bearer <firebase-token>

{
    "title": "Need help with React hooks",
    "description": "Struggling with useEffect dependencies",
    "skills": ["React", "JavaScript"],
    "urgencyLevel": "medium"
}
```

**Step 2: Express Server Receives Request**
```javascript
// In src/server.js
this.app.use(`${apiPrefix}/anonymous`, anonymousRequestRoutes)
```

**Step 3: Route Handler**
```javascript
// In src/routes/anonymousRequests.js
router.post('/request', 
  validateBody(AnonymousRequestSchemas.create),
  controller.createRequest
)
```

**Step 4: Validation Middleware**
```javascript
// Joi validation runs first
const { error, value } = schema.validate(req.body)
if (error) throw new ValidationError(...)
```

**Step 5: Controller Layer**
```javascript
// In AnonymousRequestController.js
createRequest = asyncHandler(async (req, res) => {
  const user = this.getAuthenticatedUser(req)
  const result = await this.service.create(req.body, user)
  return ResponseHelper.created(res, 'Anonymous request created', result)
})
```

**Step 6: Service Layer (Business Logic)**
```javascript
// In AnonymousRequestService.js
async create(requestData, user) {
  // Business logic validation
  this.validateRequestData(requestData)
  
  // Transform data
  const processedData = this.processRequestData(requestData, user)
  
  // Call repository
  return await this.repository.create(processedData)
}
```

**Step 7: Repository Layer (Data Access)**
```javascript
// In AnonymousRequestRepository.js
async create(data) {
  const document = new this.model(data)
  return await document.save()
}
```

**Step 8: Database Operation**
```javascript
// MongoDB operation via Mongoose
const savedRequest = await AnonymousRequest.create(processedData)
```

**Step 9: Response Journey Back**
```javascript
// Response flows back through layers:
Repository → Service → Controller → Route → Express → HTTP Response
```

**Step 10: HTTP Response**
```json
{
  "success": true,
  "message": "Anonymous request created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Need help with React hooks",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔐 Authentication System

### Firebase Integration

We use Firebase Authentication for secure user management:

**Supported Providers:**
- Email/Password
- Google OAuth
- GitHub OAuth
- Microsoft OAuth

### Authentication Flow

```javascript
// 1. Frontend sends Firebase token
Authorization: Bearer <firebase-id-token>

// 2. Backend middleware verifies token
import { verifyToken } from '../middleware/auth.js'

// 3. User attached to request
req.user = {
  uid: 'firebase-user-id',
  email: 'user@example.com',
  displayName: 'John Doe'
}
```

### Protected Routes

```javascript
// In routes
router.post('/protected-endpoint', 
  verifyToken,  // Authentication middleware
  controller.method
)
```

### Anonymous Access

Some endpoints allow anonymous access:
- Public help requests viewing
- Anonymous request creation (with rate limiting)

---

## 💾 Database Integration

### MongoDB with Mongoose

**Connection Management:**
```javascript
// config/database.js
class DatabaseConnection {
  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('Database connection failed:', error)
    }
  }
}
```

**Data Models:**
```javascript
// Example: Anonymous Request Model
const anonymousRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  urgencyLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
```

---

## 📚 API Documentation

### Standardized Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2024-01-15T10:30:00Z",
  "meta": { /* optional metadata */ }
}
```

### HTTP Status Codes

| Code | Usage | Example |
|------|-------|---------|
| `200` | Success | Data retrieved |
| `201` | Created | Resource created |
| `400` | Bad Request | Validation error |
| `401` | Unauthorized | Invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Unexpected error |

### Available Endpoints

```
GET  /                           # Welcome message
GET  /health                     # Health check
GET  /api/v1/docs               # API documentation

# Anonymous Requests
POST   /api/v1/anonymous/request      # Create anonymous request
GET    /api/v1/anonymous/requests     # List all requests
GET    /api/v1/anonymous/requests/:id # Get specific request
PUT    /api/v1/anonymous/requests/:id # Update request
DELETE /api/v1/anonymous/requests/:id # Delete request
```

---

## ⚠️ Error Handling

### Custom Error Classes

```javascript
// Base error class
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()
  }
}

// Validation error
class ValidationError extends AppError {
  constructor(message, validationErrors = []) {
    super(message, 400)
    this.validationErrors = validationErrors
  }
}
```

### Global Error Handler

```javascript
// In src/errors/errorHandler.js
export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal Server Error'
  
  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  })
  
  // Send response
  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}
```

---

## 🛡️ Security Features

### Security Middleware Stack

```javascript
// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: { /* CSP config */ },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // requests per window
})
app.use(limiter)
```

### Input Validation

```javascript
// Using Joi for validation
const createRequestSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  skills: Joi.array().items(Joi.string()).min(1).max(10),
  urgencyLevel: Joi.string().valid('low', 'medium', 'high', 'urgent')
})
```

### Data Sanitization

- Input sanitization to prevent XSS
- MongoDB injection prevention
- File upload validation
- Request size limits

---

## 🚀 Development Guide

### Running the Server

```bash
# Development mode (modern architecture)
npm run dev

# Development mode (legacy)
npm run dev:legacy

# Production mode
npm start
```

### Environment Configuration

```bash
# .env file
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skilllance
FIREBASE_PROJECT_ID=your-firebase-project
CORS_ORIGIN=http://localhost:3000
API_VERSION=v1
```

### Adding New Features

1. **Create the Model** (if needed)
2. **Create Repository** (extends BaseRepository)
3. **Create Service** (extends BaseService)
4. **Create Controller** (extends BaseController)
5. **Create Validation Schemas**
6. **Create Routes**
7. **Add Tests**

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "AnonymousRequest"

# Run with coverage
npm run test:coverage
```

---

## 🎓 Learning Objectives

### Core Node.js Concepts Demonstrated

1. **Express.js Framework**
   - Routing and middleware
   - Request/response handling
   - Error handling middleware

2. **Asynchronous Programming**
   - Promises and async/await
   - Error handling in async code
   - Non-blocking I/O operations

3. **Database Integration**
   - MongoDB with Mongoose ODM
   - Schema design and validation
   - CRUD operations

4. **Authentication & Authorization**
   - JWT token verification
   - Firebase integration
   - Middleware-based auth

5. **API Design**
   - RESTful principles
   - HTTP status codes
   - Request/response patterns

6. **Error Handling**
   - Custom error classes
   - Global error handling
   - Graceful degradation

7. **Security Best Practices**
   - Input validation
   - Rate limiting
   - CORS configuration
   - Security headers

8. **Code Organization**
   - Separation of concerns
   - Dependency injection
   - Modular architecture

### Advanced Concepts

1. **Clean Architecture**
   - Layered architecture
   - Dependency inversion
   - Testability

2. **Domain-Driven Design**
   - Business logic separation
   - Domain entities
   - Repository pattern

3. **Real-time Features**
   - Socket.IO integration
   - WebSocket handling
   - Event-driven architecture

4. **Deployment & DevOps**
   - Environment configuration
   - Process management
   - Health checks

---

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check MongoDB connection
   npm run test:db
   ```

2. **Firebase Authentication**
   ```bash
   # Verify Firebase config
   npm run test:auth
   ```

3. **Environment Variables**
   ```bash
   # Check environment setup
   npm run check:env
   ```

### Debugging Tips

1. **Enable Debug Logging**
   ```bash
   DEBUG=app:* npm run dev
   ```

2. **Check Health Endpoint**
   ```bash
   curl http://localhost:5000/health
   ```

3. **Validate API Responses**
   ```bash
   curl -X POST http://localhost:5000/api/v1/anonymous/request \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test description","skills":["Test"]}'
   ```

---

## 📈 Performance Considerations

### Optimization Strategies

1. **Database Indexing**
   - Create indexes on frequently queried fields
   - Compound indexes for complex queries

2. **Caching**
   - Redis for session storage
   - In-memory caching for frequently accessed data

3. **Request Optimization**
   - Compression middleware
   - Request size limits
   - Connection pooling

4. **Monitoring**
   - Request logging
   - Performance metrics
   - Error tracking

---

## 🔄 Migration Guide

### From Legacy to Modern Architecture

1. **Identify Business Logic**
   - Extract from route handlers
   - Move to service layer

2. **Create Repositories**
   - Abstract database operations
   - Implement base repository pattern

3. **Standardize Responses**
   - Use ResponseHelper utility
   - Consistent error handling

4. **Add Validation**
   - Joi schemas for input validation
   - Centralized validation middleware

5. **Implement Testing**
   - Unit tests for services
   - Integration tests for controllers

---

## 📝 Summary

The SkillLance backend demonstrates modern Node.js development practices with:

- **Clean Architecture** for maintainable code
- **Comprehensive error handling** for robust applications
- **Security-first approach** with multiple layers of protection
- **Scalable structure** that grows with your application
- **Real-world patterns** used in production systems

This architecture serves as both a functional backend and a learning resource for understanding how to build professional Node.js applications.

---

*This documentation is a living document. Update it as the architecture evolves and new features are added.*

# MongoDB Atlas Quick Setup Guide

## 1. Create Free Cluster
- Go to https://cloud.mongodb.com/
- Sign up/Login
- Create a new project: "CampusKarma"
- Build a database (FREE M0 Sandbox)
- Choose AWS / us-east-1 (or closest region)
- Cluster Name: "campuskarma-dev"

## 2. Configure Database Access
- Database Access → Add New Database User
- Username: `campuskarma`
- Password: Generate secure password
- Database User Privileges: "Read and write to any database"

## 3. Configure Network Access
- Network Access → Add IP Address
- Add Current IP Address (for development)
- For deployment: Add 0.0.0.0/0 (allow access from anywhere)

## 4. Get Connection String
- Clusters → Connect → Connect your application
- Driver: Node.js, Version: 4.1 or later
- Copy connection string format:
  `mongodb+srv://campuskarma:<password>@campuskarma-dev.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## 5. Update .env file
Replace this line in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/campuskarma
```

With your Atlas connection string:
```
MONGODB_URI=mongodb+srv://campuskarma:<password>@campuskarma-dev.xxxxx.mongodb.net/campuskarma?retryWrites=true&w=majority
```

## 6. Test Connection
Restart the server and check logs for successful connection.

---
This will give us:
- ✅ Cloud database ready for production
- ✅ Automatic backups and scaling
- ✅ Free tier sufficient for MVP
- ✅ Easy transition to paid plan when needed

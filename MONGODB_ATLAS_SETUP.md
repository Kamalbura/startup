# MongoDB Atlas Setup for CampusKarma

## Quick Setup Instructions

### 1. Create MongoDB Atlas Account
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a new organization: "CampusKarma"
4. Create a new project: "CampusKarma-MVP"

### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free forever)
3. Select a region close to you (e.g., AWS Mumbai for India)
4. Cluster Name: "campuskarma-cluster"
5. Click "Create Cluster"

### 3. Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `campuskarma_user`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Or add your specific IP for better security
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Databases" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

### 6. Update .env File
Replace the connection string in your backend/.env:

```
MONGODB_URI=mongodb+srv://campuskarma_user:<password>@campuskarma-cluster.xxxxx.mongodb.net/campuskarma?retryWrites=true&w=majority
```

**Important:** Replace `<password>` with your actual database user password!

### 7. Test Connection
1. Restart your backend server
2. Check console logs for successful database connection
3. The server should show: "✅ MongoDB connected successfully"

## Database Structure
The application will automatically create these collections:
- `users` - User profiles and authentication
- `tasks` - Student task requests
- `skills` - Available skills and categories
- `reviews` - User reviews and ratings

## Development vs Production
- **Development**: Use the connection string above
- **Production**: Create a separate cluster with stricter IP restrictions

## Troubleshooting
- **Connection timeout**: Check network access settings
- **Authentication failed**: Verify username/password
- **Database not found**: MongoDB will create it automatically on first write

## Next Steps After Setup
1. Update the connection string in .env
2. Restart backend server
3. Test user registration and OTP functionality
4. Verify data persistence in MongoDB Atlas dashboard

# Kelp Engine 2 - Setup Guide

This guide will help you set up and run the Kelp Engine 2 project, which consists of a Node.js backend with PostgreSQL database and a Next.js frontend.

## 🚀 Quick Start (Recommended)

**Use the automated setup script:**

**run this shell script and it will automatically start the backend , create database "kelp_engine" -> then creates table "events" -> create sql design -> setup frontend and start the frontend**

```bash
 ./z_setup_kelp_engine.sh
```

This script will:

- ✅ Check and install prerequisites
- ✅ Start PostgreSQL database
- ✅ Create the `kelp_engine` database
- ✅ Execute the events table SQL script
- ✅ Install backend and frontend dependencies
- ✅ Create necessary environment files
- ✅ Start both backend and frontend servers

## 📋 Prerequisites

Before running the script, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **PostgreSQL** (v12 or higher)
4. **Git** (for cloning the repository)

### Installing Prerequisites

#### macOS (using Homebrew):

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@14
```

#### Ubuntu/Debian:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually or the script doesn't work:

### 1. Database Setup

```bash
# Start PostgreSQL
# macOS:
brew services start postgresql@14

# Ubuntu:
sudo systemctl start postgresql

# Create database
createdb kelp_engine

# Execute SQL script
psql -d kelp_engine -f backend/events_table.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://localhost:5432/kelp_engine
PORT=3001
EOF

# Start backend
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
EOF

# Start frontend
npm run dev
```

## 🌐 Accessing the Application

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📁 Project Structure

```
kelp_engine_2/
├── backend/                 # Node.js/Express backend
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── events_table.sql   # Database schema
│   └── index.js           # Server entry point
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── package.json
└── start-kelp-engine.sh   # Setup script
```

## 🛠️ Troubleshooting

### Common Issues:

1. **PostgreSQL not starting**:

   - Check if PostgreSQL is installed: `which psql`
   - Try starting manually: `brew services start postgresql@14`
2. **Port already in use**:

   - Kill processes using ports 3000/3001: `lsof -ti:3000 | xargs kill -9`
3. **Database connection error**:

   - Verify PostgreSQL is running: `pg_isready`
   - Check database exists: `psql -l | grep kelp_engine`
4. **Permission denied**:

   - Make script executable: `chmod +x start-kelp-engine.sh`

### Stopping Services:

- **Using the script**: Press `Ctrl+C` in the terminal running the script
- **Manual**: Kill the Node.js processes manually

## 🔄 Development Workflow

1. **Start services**: `./start-kelp-engine.sh`
2. **Make changes** to your code
3. **Auto-reload**: Both frontend and backend will auto-reload on changes
4. **Stop services**: `Ctrl+C` in the script terminal

## 📝 Environment Variables

### Backend (.env):

```
DATABASE_URL=postgresql://localhost:5432/kelp_engine
PORT=3000
```

### Frontend (.env.local):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

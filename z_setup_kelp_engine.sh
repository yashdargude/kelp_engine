#!/bin/bash

# Kelp Engine 2 - Complete Setup and Startup Script
# This script sets up and starts both backend and frontend services

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PostgreSQL is running
check_postgres() {
    if command_exists pg_isready; then
        pg_isready -q
        return $?
    else
        # Fallback check for macOS
        if command_exists brew; then
            brew services list | grep postgresql | grep started >/dev/null 2>&1
            return $?
        fi
        return 1
    fi
}

# Function to start PostgreSQL
start_postgres() {
    print_status "Checking PostgreSQL status..."
    
    if check_postgres; then
        print_success "PostgreSQL is already running"
        return 0
    fi
    
    print_status "Starting PostgreSQL..."
    
    if command_exists brew; then
        # macOS with Homebrew
        brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
        sleep 3
    elif command_exists systemctl; then
        # Linux with systemd
        sudo systemctl start postgresql
        sleep 3
    elif command_exists service; then
        # Linux with service
        sudo service postgresql start
        sleep 3
    else
        print_error "Could not start PostgreSQL automatically. Please start it manually."
        return 1
    fi
    
    # Wait for PostgreSQL to be ready
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if check_postgres; then
            print_success "PostgreSQL started successfully"
            return 0
        fi
        sleep 2
        attempts=$((attempts + 1))
    done
    
    print_error "PostgreSQL failed to start within expected time"
    return 1
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw kelp_engine; then
        print_success "Database 'kelp_engine' already exists"
    else
        print_status "Creating database 'kelp_engine'..."
        createdb kelp_engine
        print_success "Database 'kelp_engine' created"
    fi
    
    # Execute SQL script
    print_status "Executing events table SQL script..."
    if psql -d kelp_engine -f backend/events_table.sql; then
        print_success "Events table created successfully"
    else
        print_error "Failed to create events table"
        return 1
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies already installed"
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning "Creating .env file for backend..."
        cat > .env << EOF
DATABASE_URL=postgresql://localhost:5432/kelp_engine
PORT=3000
EOF
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
    
    # Check if .env.local file exists
    if [ ! -f ".env.local" ]; then
        print_warning "Creating .env.local file for frontend..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
EOF
        print_success ".env.local file created"
    else
        print_success ".env.local file already exists"
    fi
    
    cd ..
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Check if backend is running
    if curl -s http://localhost:3001 >/dev/null 2>&1; then
        print_success "Backend started successfully on port 3001"
    else
        print_warning "Backend may still be starting up..."
    fi
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    sleep 8
    
    # Check if frontend is running
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend started successfully on port 3000"
    else
        print_warning "Frontend may still be starting up..."
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi
    
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo "🚀 Kelp Engine 2 - Complete Setup and Startup"
    echo "=============================================="
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command_exists psql; then
        print_error "PostgreSQL client (psql) is not installed. Please install PostgreSQL first."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
    
    # Start PostgreSQL
    if ! start_postgres; then
        print_error "Failed to start PostgreSQL. Please start it manually and try again."
        exit 1
    fi
    
    # Setup database
    if ! setup_database; then
        print_error "Failed to setup database."
        exit 1
    fi
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Start services
    start_backend
    start_frontend
    
    echo ""
    echo "🎉 Kelp Engine 2 is now running!"
    echo "================================="
    echo "Frontend: http://localhost:3001"
    echo "Backend:  http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo ""
    
    # Keep script running
    wait
}

# Run main function
main "$@" 

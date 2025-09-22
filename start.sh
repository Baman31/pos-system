#!/bin/bash

# Get the project directory
PROJECT_DIR="$PWD"

# Create MongoDB data directory
mkdir -p /tmp/mongodb/data

# Start MongoDB in the background
echo "Starting MongoDB..."
mongod --dbpath /tmp/mongodb/data --fork --logpath /tmp/mongodb/mongo.log

# Wait a moment for MongoDB to start
sleep 2

# Start the backend server in the background
echo "Starting backend server..."
cd "$PROJECT_DIR/server" && npm run start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Return to project directory and start frontend
echo "Starting frontend server..."
cd "$PROJECT_DIR"
npm run dev

# If frontend exits, kill the backend
kill $BACKEND_PID 2>/dev/null
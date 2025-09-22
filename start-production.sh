#!/bin/bash

# Create MongoDB data directory
mkdir -p /tmp/mongodb/data

# Start MongoDB in the background
echo "Starting MongoDB for production..."
mongod --dbpath /tmp/mongodb/data --fork --logpath /tmp/mongodb/mongo.log

# Wait for MongoDB to start
sleep 3

# Start the backend server in the background  
echo "Starting production backend server..."
cd server && NODE_ENV=production npm run start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend preview server
echo "Starting production frontend server..."
cd ..
NODE_ENV=production npm run preview -- --host 0.0.0.0 --port 5000

# If frontend exits, kill the backend
kill $BACKEND_PID 2>/dev/null
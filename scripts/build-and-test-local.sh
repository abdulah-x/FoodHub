#!/bin/bash
# Local Docker Build and Test Script

echo "🐋 Building FoodHub Docker Images locally..."

echo "📝 Copying environment file..."
cp .env.example .env

echo "🏗️ Building Backend Docker Image..."
cd backend
docker build -t foodhub-backend:local .
cd ..

echo "🏗️ Building Frontend Docker Image..."
docker build -t foodhub-frontend:local .

echo "🚀 Starting services with docker-compose..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service status..."
docker-compose ps

echo "🌐 Application should be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   MongoDB: localhost:27017"

echo "📊 Checking service health..."
echo "Backend Health:"
curl -s http://localhost:8080/health | jq . || echo "Backend not ready yet"

echo "Frontend Health:"
curl -s http://localhost:3000/health || echo "Frontend not ready yet"

echo "📝 To view logs:"
echo "   docker-compose logs -f"
echo "📝 To stop services:"
echo "   docker-compose down"
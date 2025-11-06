@echo off
REM Windows Batch Script for Local Docker Build and Test

echo 🐋 Building FoodHub Docker Images locally...

echo 📝 Copying environment file...
copy .env.example .env

echo 🏗️ Building Backend Docker Image...
cd backend
docker build -t foodhub-backend:local .
cd ..

echo 🏗️ Building Frontend Docker Image...
docker build -t foodhub-frontend:local .

echo 🚀 Starting services with docker-compose...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak > nul

echo 🔍 Checking service status...
docker-compose ps

echo 🌐 Application should be available at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8080
echo    MongoDB: localhost:27017

echo 📊 Checking service health...
echo Backend Health:
curl -s http://localhost:8080/health

echo Frontend Health:
curl -s http://localhost:3000/health

echo 📝 To view logs:
echo    docker-compose logs -f
echo 📝 To stop services:
echo    docker-compose down

pause
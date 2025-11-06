@echo off
REM Windows Build and Push to Docker Hub Script

if "%1"=="" (
    echo ❌ Usage: %0 ^<docker-hub-username^>
    echo Example: %0 myusername
    exit /b 1
)

set DOCKER_USERNAME=%1
set VERSION=%2
if "%VERSION%"=="" set VERSION=latest

echo 🏗️ Building and pushing FoodHub images to Docker Hub...

REM Build and push backend
echo 📦 Building backend image...
cd backend
docker build -t %DOCKER_USERNAME%/foodhub-backend:%VERSION% .
echo 📤 Pushing backend image...
docker push %DOCKER_USERNAME%/foodhub-backend:%VERSION%
cd ..

REM Build and push frontend
echo 📦 Building frontend image...
docker build -t %DOCKER_USERNAME%/foodhub-frontend:%VERSION% .
echo 📤 Pushing frontend image...
docker push %DOCKER_USERNAME%/foodhub-frontend:%VERSION%

echo ✅ All images pushed successfully!
echo Backend: %DOCKER_USERNAME%/foodhub-backend:%VERSION%
echo Frontend: %DOCKER_USERNAME%/foodhub-frontend:%VERSION%

echo 🎉 Ready for AWS EC2 deployment!
echo Copy docker-compose.prod.yml and .env.prod to your EC2 instance

pause
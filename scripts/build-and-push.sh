#!/bin/bash
# Build and Push to Docker Hub Script

# Check if DOCKER_USERNAME is set
if [ -z "$1" ]; then
    echo "❌ Usage: $0 <docker-hub-username>"
    echo "Example: $0 myusername"
    exit 1
fi

DOCKER_USERNAME=$1
VERSION=${2:-latest}

echo "🏗️ Building and pushing FoodHub images to Docker Hub..."

# Build and push backend
echo "📦 Building backend image..."
cd backend
docker build -t ${DOCKER_USERNAME}/foodhub-backend:${VERSION} .
echo "📤 Pushing backend image..."
docker push ${DOCKER_USERNAME}/foodhub-backend:${VERSION}
cd ..

# Build and push frontend
echo "📦 Building frontend image..."
docker build -t ${DOCKER_USERNAME}/foodhub-frontend:${VERSION} .
echo "📤 Pushing frontend image..."
docker push ${DOCKER_USERNAME}/foodhub-frontend:${VERSION}

echo "✅ All images pushed successfully!"
echo "Backend: ${DOCKER_USERNAME}/foodhub-backend:${VERSION}"
echo "Frontend: ${DOCKER_USERNAME}/foodhub-frontend:${VERSION}"

# Update production docker-compose file
echo "📝 Updating production docker-compose file..."
sed -i "s/\${DOCKER_USERNAME}/${DOCKER_USERNAME}/g" docker-compose.prod.yml

echo "🎉 Ready for AWS EC2 deployment!"
echo "Copy docker-compose.prod.yml and .env.prod to your EC2 instance"
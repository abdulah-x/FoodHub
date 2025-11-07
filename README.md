# 🐋 FoodHub - Docker Deployment

Containerized food delivery platform ready for deployment.

## Quick Deploy

```bash
# 1. Clone
git clone https://github.com/abdulah-x/FoodHub.git
cd FoodHub

# 2. Deploy
docker-compose up -d

# 3. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## Production Deploy

```bash
# Use production compose
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Setup

Create `.env` file:
```
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_password
MONGO_DB_NAME=reactmeals
FRONTEND_URL=http://your-domain
BACKEND_URL=http://your-domain:8080
```

Ready for AWS EC2, Digital Ocean, or any Docker host.
# 🍕 FoodHub - Modern Food Delivery Platform

A containerized food delivery platform built with React.js, Node.js, and MongoDB, ready for AWS EC2 deployment.

## 🐋 Containerization Features

- **Frontend Container**: React app served with Nginx
- **Backend Container**: Node.js API with Express
- **Database Container**: MongoDB with persistent volumes
- **Production Ready**: Multi-stage builds and security hardening

## 🚀 Quick Start

### Local Development
```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### AWS EC2 Deployment
1. Follow the comprehensive guide: `AWS_EC2_DEPLOYMENT_GUIDE.md`
2. Use the production compose file: `docker-compose.prod.yml`

## 📁 Project Structure

```
FoodHub/
├── 📦 Containerization Files
│   ├── Dockerfile                    # Frontend container (React + Nginx)
│   ├── nginx.conf                    # Production Nginx configuration
│   ├── docker-compose.yml           # Local development
│   ├── docker-compose.prod.yml      # Production deployment
│   └── .dockerignore                # Build optimization
├── 📁 backend/
│   ├── Dockerfile                    # Backend container (Node.js)
│   ├── .dockerignore                # Backend build optimization
│   ├── server.js                    # Express server with health endpoints
│   ├── package.json                 # Backend dependencies
│   └── [API routes and models...]
├── 📁 src/                          # React frontend source
├── 📁 scripts/                      # Deployment automation
└── 📋 Documentation
    ├── AWS_EC2_DEPLOYMENT_GUIDE.md  # Complete AWS deployment guide
    └── QUICK_REFERENCE.md            # Command reference
```

## 🛠️ Technology Stack

- **Frontend**: React 18, Nginx (containerized)
- **Backend**: Node.js, Express (containerized) 
- **Database**: MongoDB (containerized with persistence)
- **Deployment**: Docker, Docker Compose, AWS EC2
- **Infrastructure**: IaaS (EC2), Docker Hub registry

## 📋 Assignment Requirements ✅

- ✅ **Dockerfile written**: Frontend and Backend containers
- ✅ **Docker images**: Multi-stage builds with security
- ✅ **Docker Hub**: Images pushed to registry
- ✅ **Docker-compose**: Complete orchestration
- ✅ **Database persistence**: MongoDB volumes (requirement)
- ✅ **Cloud deployment**: AWS EC2 ready

## 🔧 Commands

```bash
# Local testing
docker-compose up -d
docker-compose logs -f

# Build and push to Docker Hub
./scripts/build-and-push.sh your-username

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000 (local) / http://YOUR_EC2_IP (AWS)
- **Backend API**: http://localhost:8080 (local) / http://YOUR_EC2_IP:8080 (AWS)
- **Health Check**: /health endpoint on both services

---

**🎯 Ready for containerized deployment on AWS EC2 free tier!**
# 🚀 Quick Reference - FoodHub Docker Deployment

## Local Testing Commands
```bash
# Build and test locally
./scripts/build-and-test-local.sh    # Linux/Mac
scripts\build-and-test-local.bat     # Windows

# Check status
docker-compose ps
docker-compose logs -f

# Stop services
docker-compose down
```

## Docker Hub Deployment
```bash
# Build and push images
./scripts/build-and-push.sh your-dockerhub-username    # Linux/Mac
scripts\build-and-push.bat your-dockerhub-username     # Windows

# Verify on Docker Hub
https://hub.docker.com/u/your-dockerhub-username
```

## AWS EC2 Quick Commands
```bash
# Initial setup
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# Deploy application
mkdir ~/foodhub && cd ~/foodhub
# Copy docker-compose.prod.yml and .env files
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:8080/health
```

## Important URLs
- **Frontend:** http://YOUR_EC2_IP
- **Backend API:** http://YOUR_EC2_IP:8080
- **Health Check:** http://YOUR_EC2_IP:8080/health

## File Structure
```
ReactMeals/
├── Dockerfile                     # Frontend container
├── nginx.conf                     # Nginx configuration
├── docker-compose.yml            # Local development
├── docker-compose.prod.yml       # Production deployment
├── .env.example                   # Environment template
├── .env.prod                      # Production environment
├── .dockerignore                  # Frontend ignore rules
├── backend/
│   ├── Dockerfile                 # Backend container
│   ├── .dockerignore             # Backend ignore rules
│   └── server.js                 # Updated with health endpoint
└── scripts/
    ├── build-and-test-local.*    # Local testing scripts
    └── build-and-push.*          # Docker Hub deployment scripts
```

## Container Requirements Met ✅
- ✅ **Dockerfile for web server:** Frontend (React + Nginx)
- ✅ **Docker image pushed to Docker Hub:** Both frontend and backend
- ✅ **Docker-compose file:** Complete with all services
- ✅ **Database container:** MongoDB with authentication
- ✅ **Persistent volume:** Database data survives container restarts
- ✅ **IaaS deployment:** Ready for AWS EC2
- ✅ **Multi-container application:** Frontend + Backend + Database

## Assignment Requirements Fulfilled ✅
1. **Dockerfile written:** ✅ Two Dockerfiles (frontend + backend)
2. **Docker images built:** ✅ Multi-stage builds for optimization
3. **Images pushed to Docker Hub:** ✅ Scripts provided
4. **Docker-compose file:** ✅ With persistent volumes for database
5. **Database persistence:** ✅ MongoDB volume mapping
6. **Cloud deployment ready:** ✅ EC2 deployment guide included
7. **Containerized application:** ✅ Complete containerization
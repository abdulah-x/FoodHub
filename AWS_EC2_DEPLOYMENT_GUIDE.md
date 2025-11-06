# 🚀 AWS EC2 Free Tier Deployment Guide

## FoodHub Containerized Deployment on AWS EC2

This guide provides step-by-step instructions for deploying the FoodHub application on AWS EC2 using the free tier.

---

## 📋 Prerequisites

1. **AWS Account** with free tier access
2. **Docker Hub Account** to host your container images
3. **Basic knowledge** of AWS EC2 and Docker
4. **SSH Client** (PuTTY on Windows, Terminal on Mac/Linux)

---

## 🏗️ Phase 1: Prepare Docker Images

### Step 1: Build and Push Images to Docker Hub

1. **Login to Docker Hub:**
   ```bash
   docker login
   ```

2. **Run the build script:**
   
   **On Windows:**
   ```cmd
   scripts\build-and-push.bat your-dockerhub-username
   ```
   
   **On Linux/Mac:**
   ```bash
   chmod +x scripts/build-and-push.sh
   ./scripts/build-and-push.sh your-dockerhub-username
   ```

3. **Verify images are pushed:**
   - Visit your Docker Hub account
   - Confirm `foodhub-backend` and `foodhub-frontend` repositories exist

---

## ☁️ Phase 2: AWS EC2 Setup

### Step 2: Launch EC2 Instance (Free Tier)

1. **Login to AWS Console:**
   - Navigate to EC2 Dashboard
   - Click "Launch Instance"

2. **Configure Instance:**
   ```
   Name: FoodHub-Server
   AMI: Ubuntu Server 22.04 LTS (Free tier eligible)
   Instance Type: t2.micro (Free tier eligible)
   Key Pair: Create new or use existing
   ```

3. **Security Group Settings:**
   ```
   Type            | Protocol | Port Range | Source
   SSH             | TCP      | 22         | Your IP
   HTTP            | TCP      | 80         | 0.0.0.0/0
   HTTPS           | TCP      | 443        | 0.0.0.0/0
   Custom TCP      | TCP      | 3000       | 0.0.0.0/0
   Custom TCP      | TCP      | 8080       | 0.0.0.0/0
   Custom TCP      | TCP      | 27017      | 0.0.0.0/0
   ```

4. **Storage:** 
   - 30 GB gp2 (Free tier allows up to 30GB)

5. **Launch Instance**

### Step 3: Connect to EC2 Instance

1. **Get connection details:**
   - Note down the Public IPv4 address
   - Download the key pair (.pem file)

2. **Connect via SSH:**
   
   **Linux/Mac:**
   ```bash
   chmod 400 your-key.pem
   ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
   ```
   
   **Windows (using PuTTY):**
   - Convert .pem to .ppk using PuTTYgen
   - Use PuTTY with the .ppk file

---

## 🐋 Phase 3: Docker Installation on EC2

### Step 4: Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
sudo apt update

# Install Docker CE
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add current user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply group changes
exit
# Reconnect via SSH

# Verify installation
docker --version
docker-compose --version
```

---

## 🚀 Phase 4: Deploy FoodHub Application

### Step 5: Prepare Deployment Files

1. **Create application directory:**
   ```bash
   mkdir -p ~/foodhub
   cd ~/foodhub
   ```

2. **Create docker-compose.prod.yml:**
   ```bash
   nano docker-compose.prod.yml
   ```
   
   Copy the content from your local `docker-compose.prod.yml` file and update the `DOCKER_USERNAME` placeholder with your actual Docker Hub username.

3. **Create environment file:**
   ```bash
   nano .env
   ```
   
   ```env
   # Database Configuration
   MONGO_ROOT_USERNAME=foodhub_admin
   MONGO_ROOT_PASSWORD=YourSecurePassword123!
   MONGO_DB_NAME=reactmeals_prod
   
   # Application URLs (replace with your EC2 public IP)
   FRONTEND_URL=http://YOUR_EC2_PUBLIC_IP
   BACKEND_URL=http://YOUR_EC2_PUBLIC_IP:8080
   
   # Docker Hub Configuration
   DOCKER_USERNAME=your-dockerhub-username
   ```

4. **Create data directories:**
   ```bash
   sudo mkdir -p /opt/foodhub/data/mongodb
   sudo mkdir -p /opt/foodhub/data/mongodb-config
   sudo mkdir -p /opt/foodhub/logs
   sudo chown -R $USER:$USER /opt/foodhub
   ```

### Step 6: Deploy the Application

1. **Start the services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose -f docker-compose.prod.yml logs -f
   
   # Specific service
   docker-compose -f docker-compose.prod.yml logs -f backend
   ```

---

## 🔍 Phase 5: Verification and Testing

### Step 7: Test the Application

1. **Health Checks:**
   ```bash
   # Backend health
   curl http://localhost:8080/health
   
   # Frontend health (from local machine)
   curl http://YOUR_EC2_PUBLIC_IP/health
   ```

2. **Access the Application:**
   - **Frontend:** `http://YOUR_EC2_PUBLIC_IP`
   - **Backend API:** `http://YOUR_EC2_PUBLIC_IP:8080`

3. **Database Connection Test:**
   ```bash
   # Connect to MongoDB container
   docker exec -it foodhub-mongodb-prod mongosh -u foodhub_admin -p
   ```

---

## 🛠️ Phase 6: Maintenance and Monitoring

### Step 8: Essential Commands

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Update images and restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# View resource usage
docker stats

# Cleanup unused images/containers
docker system prune -a

# Backup MongoDB data
sudo tar -czf foodhub-backup-$(date +%Y%m%d).tar.gz /opt/foodhub/data/mongodb

# View disk usage
df -h
```

### Step 9: Security Hardening (Optional but Recommended)

1. **Update security group (remove unnecessary ports):**
   - Close port 27017 to public (only allow internal Docker network)
   - Close port 8080 if frontend properly proxies API calls

2. **Setup UFW firewall:**
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 3000
   ```

3. **Regular updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 💰 Cost Optimization for Free Tier

### Staying Within Free Tier Limits:

1. **EC2 Instance:**
   - Use t2.micro (750 hours/month free)
   - Monitor usage in AWS billing dashboard

2. **Storage:**
   - 30 GB EBS storage (free)
   - Regular cleanup of Docker images/logs

3. **Data Transfer:**
   - 15 GB outbound per month (free)
   - Monitor in CloudWatch

4. **Monitoring:**
   ```bash
   # Check storage usage
   df -h
   
   # Check Docker usage
   docker system df
   
   # Clean up if needed
   docker system prune -a --volumes
   ```

---

## 🚨 Troubleshooting

### Common Issues:

1. **Out of memory errors:**
   ```bash
   # Check memory usage
   free -h
   
   # Restart services if needed
   docker-compose -f docker-compose.prod.yml restart
   ```

2. **Port conflicts:**
   ```bash
   # Check what's using ports
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :8080
   ```

3. **Database connection issues:**
   ```bash
   # Check MongoDB logs
   docker-compose -f docker-compose.prod.yml logs mongodb
   
   # Restart MongoDB
   docker-compose -f docker-compose.prod.yml restart mongodb
   ```

4. **Image pull errors:**
   ```bash
   # Login to Docker Hub on EC2
   docker login
   
   # Pull images manually
   docker pull your-username/foodhub-backend:latest
   docker pull your-username/foodhub-frontend:latest
   ```

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Frontend accessible at `http://YOUR_EC2_PUBLIC_IP`
- ✅ Backend health check returns status 200
- ✅ Database persistence works (data survives container restarts)
- ✅ All three containers (frontend, backend, mongodb) are running
- ✅ Application functionality works (login, restaurant browsing, etc.)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs -f`
3. Verify environment variables in `.env` file
4. Ensure security group allows required ports
5. Check AWS free tier usage limits

---

**🎉 Congratulations! Your FoodHub application is now running on AWS EC2 with Docker containers and persistent MongoDB storage!**
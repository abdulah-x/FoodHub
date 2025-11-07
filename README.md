# 🍕 FoodHub - Modern Food Delivery Platform

A full-stack, containerized food delivery platform built with React.js, Node.js, and MongoDB. FoodHub transforms the traditional food ordering experience with a modern, role-based architecture supporting customers, restaurant owners, and administrators.

## 📖 Project Overview

FoodHub is a comprehensive food delivery platform that evolved from a simple ReactMeals application into a production-ready system. The platform features beautiful modern design, complete database integration, and role-based access control with dedicated interfaces for different user types.

### 🎯 Key Features

#### 🍽️ **Customer Experience**
- **Modern Restaurant Discovery**: Browse restaurants with beautiful image cards and glassmorphism effects
- **Smart Search & Filtering**: Real-time search by name, cuisine, or description with advanced filtering options
- **Interactive Ratings**: Visual star rating system with review counts and restaurant badges
- **Responsive Design**: Mobile-first design with smooth animations and transitions
- **Shopping Cart**: Complete order management with real-time cart updates
- **Order Tracking**: Monitor order status and history

#### 🏪 **Restaurant Management**
- **Restaurant Dashboard**: Overview of orders, revenue, and performance metrics
- **Menu Management**: Add, edit, and manage menu items with pricing and descriptions
- **Order Processing**: Real-time order management and status updates
- **Profile Management**: Update restaurant information, hours, and settings
- **Analytics**: View business performance and customer insights

#### 👑 **Admin Control Panel**
- **System Analytics**: Comprehensive dashboard with platform-wide metrics
- **User Management**: Manage customer accounts and permissions
- **Restaurant Oversight**: Approve and monitor restaurant registrations
- **Platform Monitoring**: Track system performance and user activity

### 🏗️ Architecture & Technology

#### **Frontend Stack**
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for multi-module navigation
- **CSS Modules**: Component-scoped styling with modern design principles
- **Context API**: State management for user authentication and cart functionality
- **Axios**: HTTP client for seamless API communication
- **Socket.io Client**: Real-time notifications and updates

#### **Backend Stack**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Fast and minimal web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling
- **Socket.io**: Real-time bidirectional event-based communication
- **RESTful API**: Clean API architecture with full CRUD operations

#### **DevOps & Deployment**
- **Docker**: Containerization for consistent deployment across environments
- **Docker Compose**: Multi-container orchestration
- **Nginx**: High-performance web server and reverse proxy
- **Multi-stage Builds**: Optimized container images for production
- **Health Checks**: Container monitoring and automatic recovery

## 🐋 Containerization Features

- **Frontend Container**: React application served by Nginx with production optimizations
- **Backend Container**: Node.js API server with health monitoring
- **Database Container**: MongoDB with persistent data storage
- **Network Isolation**: Secure communication between containers
- **Volume Persistence**: Database data survives container restarts
- **Environment Configuration**: Flexible configuration for different deployment environments

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository
- Basic understanding of containerized applications

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abdulah-x/FoodHub.git
   cd FoodHub
   ```

2. **Set Up Environment**
   ```bash
   cp .env.template .env
   # Edit .env with your configuration
   ```

3. **Start the Application**
   ```bash
   docker-compose up -d
   ```

4. **Access the Platform**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Health Check**: http://localhost:8080/health

### Environment Configuration

Create a `.env` file based on `.env.template`:

```env
# Database Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DB_NAME=reactmeals

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080

# Docker Hub Configuration (for production deployment)
DOCKER_USERNAME=your-dockerhub-username
```

## 🔄 User Roles & Access

### 👤 **Customer Users**
- Browse and search restaurants
- View menus and place orders
- Track order status and history
- Rate and review restaurants
- Manage personal profile and preferences

### 🏪 **Restaurant Owners**
- Manage restaurant profile and menu items
- Process incoming orders and update status
- View sales analytics and performance metrics
- Handle customer communications
- Manage operating hours and availability

### 👑 **Platform Administrators**
- Oversee entire platform operations
- Manage user accounts and permissions
- Monitor restaurant activities and compliance
- Access comprehensive system analytics
- Handle platform-wide configurations

## 💾 Database Schema

The application uses MongoDB with the following main collections:

- **Users**: Customer, restaurant owner, and admin profiles
- **Restaurants**: Restaurant information, cuisine types, and ratings
- **MenuItems**: Food items with descriptions, prices, and availability
- **Orders**: Order transactions with status tracking and history

## 🌐 API Endpoints

### Authentication & Users
- `POST /api/users/login` - User authentication
- `POST /api/users` - User registration
- `GET /api/users` - Get all users (admin only)

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `POST /api/restaurants` - Create new restaurant
- `PUT /api/restaurants/:id` - Update restaurant information

### Menu Management
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item

### Order Processing
- `POST /api/orders` - Place new order
- `GET /api/orders/customer/:id` - Get customer orders
- `PUT /api/orders/:id/status` - Update order status

## 🚢 Production Deployment

### Using Docker Hub Images

1. **Build and Push Images**
   ```bash
   # Build images
   docker build -t your-username/foodhub-frontend .
   docker build -t your-username/foodhub-backend ./backend
   
   # Push to Docker Hub
   docker push your-username/foodhub-frontend
   docker push your-username/foodhub-backend
   ```

2. **Deploy with Production Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment (AWS EC2, DigitalOcean, etc.)

1. **Set up your cloud instance**
2. **Install Docker and Docker Compose**
3. **Clone repository and configure environment**
4. **Deploy using production compose file**

## 🔧 Development

### Local Development Setup

1. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install
   ```

2. **Start Development Servers**
   ```bash
   # Frontend (React development server)
   npm start
   
   # Backend (Node.js with nodemon)
   cd backend && npm run dev
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB container
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

### Container Development

```bash
# Build containers locally
docker-compose build

# Start with logs
docker-compose up

# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend
```

## 📱 User Interface Features

- **Modern Design**: Glassmorphism effects and gradient backgrounds
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Real-time Updates**: Live notifications and order status updates
- **Intuitive Navigation**: Role-based routing and user-friendly interfaces

## 🔒 Security Features

- **Container Security**: Non-root users and minimal attack surface
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **Health Monitoring**: Container health checks and automatic recovery

## 📊 Monitoring & Logging

- **Health Endpoints**: `/health` endpoint for service monitoring
- **Container Logs**: Centralized logging with Docker Compose
- **Performance Metrics**: Built-in monitoring capabilities
- **Error Handling**: Comprehensive error tracking and reporting

## 🤝 Contributing

This project is designed for educational and demonstration purposes. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker containers
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Use Cases

- **Learning Platform**: Perfect for understanding full-stack development
- **Portfolio Project**: Demonstrates modern web development skills
- **Base Template**: Foundation for building food delivery platforms
- **Containerization Example**: Shows Docker best practices
- **Cloud Deployment**: Ready for various cloud platforms

---

**FoodHub represents a complete, modern web application showcasing full-stack development, containerization, and cloud deployment capabilities. Perfect for developers looking to understand contemporary web application architecture and deployment strategies.**
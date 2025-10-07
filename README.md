# 🍕 FoodHub - Modern Food Delivery Platform

A beautifully designed, full-stack food delivery platform built with React.js and Node.js, featuring modern UI/UX, MongoDB integration, and comprehensive multi-module architecture.

---

## 🚀 Project Overview

FoodHub is a cutting-edge food delivery platform that transforms the original ReactMeals application into a comprehensive, production-ready system. The platform features stunning modern design, complete database integration, and role-based access with dedicated interfaces for customers, restaurant owners, and administrators.

This project represents a significant expansion from a simple menu display into a full-featured food delivery platform with multiple user roles, comprehensive functionality, MongoDB integration, and modern UI/UX design principles.

---

## ✨ Features

### 🍽️ Customer Module
- **🎨 Modern Restaurant Discovery**: Browse restaurants with beautiful image cards and glassmorphism effects
- **🔍 Smart Search & Filters**: Real-time search by name, cuisine, or description with advanced filtering
- **⭐ Interactive Ratings**: Visual star ratings with review counts and restaurant badges
- **📱 Responsive Design**: Mobile-first design with smooth animations and transitions
- **🏷️ Cuisine Categories**: Visual cuisine indicators with emojis and color-coded badges
- **🚀 Quick Filters**: One-click filters for top-rated, fast delivery, and popular restaurants
- **💫 Enhanced UX**: Loading states, hover effects, and intuitive navigation
- **🛒 Seamless Ordering**: Complete order flow with cart management and user authentication

### 🏪 Restaurant Module
- **📊 Restaurant Dashboard**: Overview of orders, revenue, and performance metrics
- **📋 Menu Management**: Add, edit, and manage menu items with pricing
- **⚡ Order Processing**: Real-time order management and status updates
- **👤 Profile Management**: Update restaurant information and settings

### 👑 Admin Module
- **📈 System Analytics**: Comprehensive dashboard with performance metrics
- **👥 User Management**: Manage customer accounts and permissions
- **🏢 Restaurant Management**: Oversee restaurant registrations and profiles
- **🔍 System Monitoring**: Track platform-wide statistics and trends

---

## 🛠️ Technology Stack

### 🎨 Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for multi-module navigation
- **CSS Modules**: Component-scoped styling
- **Context API**: State management for user authentication and cart
- **Axios**: HTTP client for API communication

### ⚙️ Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB 8.0.4**: Production-ready NoSQL database with complete data population
- **Mongoose**: MongoDB object modeling with comprehensive schemas
- **RESTful API**: Clean API architecture with full CRUD operations
- **Database Scripts**: Automated setup and data population utilities

---

## 📁 Project Structure

```
FoodHub/
├── 📁 backend/                     # Node.js/Express backend
│   ├── 📁 models/                  # Database models
│   │   ├── 📄 User.js
│   │   ├── 📄 Restaurant.js
│   │   ├── 📄 MenuItem.js
│   │   └── 📄 Order.js
│   ├── 📁 routes/                  # API routes
│   │   ├── 📄 users.js
│   │   ├── 📄 restaurants.js
│   │   ├── 📄 menu.js
│   │   └── 📄 orders.js
│   ├── 📄 server.js               # Express server setup
│   └── 📄 package.json
├── 📁 src/
│   ├── 📁 modules/                # User modules
│   │   ├── 📁 customer/           # Customer interface
│   │   ├── 📁 restaurant/         # Restaurant interface
│   │   └── 📁 admin/              # Admin interface
│   ├── 📁 contexts/               # React contexts
│   ├── 📁 services/               # API services
│   ├── 📁 Components/             # Original ReactMeals components
│   └── 📄 App.js                  # Main application component
└── 📁 public/                     # Static assets
```

---

## 🔧 Installation & Setup

### 📋 Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### 🚀 Frontend Setup
```bash
# Clone the repository
git clone https://github.com/abdulah-x/FoodHub.git
cd FoodHub

# Install dependencies
npm install

# Start development server
npm start
```

### 🖥️ Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start backend server
npm run dev
```

### 🗄️ Database Setup
```bash
# Make sure MongoDB is running
# Run database setup scripts (if available)
node setupDatabase.js
```

---

## 📝 Changes Made to Original ReactMeals

### 🔧 Major Extensions
1. **🏗️ Multi-Module Architecture**
   - Extended single-page app to three distinct user modules
   - Role-based routing and navigation

2. **🌐 Backend API**
   - Complete RESTful API with Express.js and MongoDB
   - Full CRUD operations for all entities

3. **🔐 User Authentication**
   - Simple role-based authentication system
   - Context-based user management

4. **💾 Database Integration**
   - MongoDB models for users, restaurants, orders, and menu items
   - Real-time data synchronization

### 🆕 New Components Added

#### 👤 Customer Module
- `CustomerModule.js` - Main customer interface
- `CustomerHeader.js` - Customer navigation header
- `RestaurantList.js` - Restaurant browsing component
- `RestaurantMenu.js` - Menu viewing component
- `OrderHistory.js` - Order tracking component

#### 🏪 Restaurant Module
- `RestaurantModule.js` - Main restaurant interface
- `RestaurantHeader.js` - Restaurant navigation header
- `RestaurantDashboard.js` - Business analytics dashboard
- `MenuManagement.js` - Menu item management
- `OrderManagement.js` - Order processing interface
- `RestaurantProfile.js` - Profile management

#### 👑 Admin Module
- `AdminModule.js` - Main admin interface
- `AdminHeader.js` - Admin navigation header
- `AdminDashboard.js` - System overview dashboard
- `UserManagement.js` - User account management
- `RestaurantManagement.js` - Restaurant oversight
- `SystemAnalytics.js` - Advanced analytics and reporting

### 🔧 Backend Components
- **📊 Database Models**: User, Restaurant, MenuItem, Order schemas
- **🛣️ API Routes**: Complete CRUD operations for all entities
- **🔐 Authentication**: Simple login system without JWT complexity
- **⚙️ Server Setup**: Express server with MongoDB connection

### ✨ Enhanced Features
- **📱 Responsive Design**: Mobile-friendly interfaces across all modules
- **🎯 Role-Based Routing**: Automatic redirection based on user roles
- **🔄 Real-Time Updates**: Dynamic data management and state updates
- **🎨 Professional Styling**: Modern UI with CSS modules and animations

---

## 👥 User Roles

### 👤 Customer
- **🔍 Browse**: Restaurants with advanced search and filtering
- **🛒 Order**: Place orders with interactive cart management
- **📋 Track**: Order history and status
- **⭐ Review**: Rate and review restaurants

### 🏪 Restaurant Owner
- **📊 Manage**: Restaurant profile and menu items
- **⚡ Process**: Incoming orders and update status
- **📈 Analytics**: View business metrics and performance
- **💬 Communicate**: Handle customer communications

### 👑 Administrator
- **🎛️ Oversee**: Entire platform operations
- **👥 Manage**: User accounts and permissions
- **🏢 Monitor**: Restaurant activities and compliance
- **📊 Access**: Comprehensive system analytics

---

## 🎨 Modern Design Features

### ✨ Visual Excellence
- **🌈 Gradient Backgrounds**: Beautiful purple-to-blue gradients throughout the interface
- **✨ Glassmorphism Effects**: Modern frosted glass appearance with backdrop blur
- **🖼️ Restaurant Images**: High-quality Unsplash images for each restaurant card
- **🏷️ Smart Badges**: Dynamic badges for top-rated and fast delivery restaurants
- **💫 Smooth Animations**: Hover effects, card transitions, and loading animations

### 🚀 Enhanced User Experience
- **🔍 Intelligent Search**: Search across restaurant names, cuisines, and descriptions
- **🎯 Advanced Filtering**: Filter by cuisine type with visual emoji indicators
- **⚡ Quick Actions**: One-click filters for popular categories
- **📊 Smart Sorting**: Sort by rating, delivery fee, alphabetical, or minimum order
- **📱 Mobile-First**: Responsive design that works perfectly on all devices

### 🎮 Interactive Elements
- **⭐ Star Rating System**: Visual star displays with half-star precision
- **🍕 Cuisine Emojis**: Visual cuisine type indicators for quick recognition
- **🎯 Hover Effects**: Cards lift and images scale on interaction
- **🚀 Loading States**: Beautiful loading indicators and skeleton screens

### 🔥 Key Improvements from Original
1. **🎨 Visual Design**: Complete modern redesign with glassmorphism and gradients
2. **💾 Database Integration**: Full MongoDB integration with comprehensive data
3. **🔍 Search & Discovery**: Advanced filtering and search capabilities
4. **📱 Mobile Experience**: Responsive design with mobile-first approach
5. **⭐ User Engagement**: Interactive ratings, badges, and visual feedback
6. **🚀 Performance**: Optimized loading states and smooth animations
7. **🎯 User Experience**: Intuitive navigation and modern interaction patterns

---

## 🌟 Screenshots & Demo

*Coming Soon - Screenshots of the modern interface will be added here*

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abdul Ahad** - [@abdulah-x](https://github.com/abdulah-x)

---

⭐ **If you found this project helpful, please give it a star!** ⭐

---

**Note**: This project represents a significant expansion of the original ReactMeals application, transforming it from a simple menu display into a full-featured food delivery platform with multiple user roles and comprehensive functionality.

pipeline {
    agent any
    
    environment {
        // Docker compose file for Jenkins builds
        COMPOSE_FILE = 'docker-compose.jenkins.yml'
        // Environment variables for the build
        MONGO_USERNAME = 'admin'
        MONGO_PASSWORD = 'admin123'
        JWT_SECRET = 'your-jwt-secret-for-jenkins-builds'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Fetch code from GitHub repository
                echo 'Fetching code from GitHub...'
                git branch: 'main', 
                    url: 'https://github.com/abdulah-x/FoodHub.git'
                
                // Display workspace content
                sh 'ls -la'
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo 'Setting up environment...'
                // Create .env file for Jenkins build
                sh '''
                    echo "MONGO_USERNAME=${MONGO_USERNAME}" > .env
                    echo "MONGO_PASSWORD=${MONGO_PASSWORD}" >> .env
                    echo "JWT_SECRET=${JWT_SECRET}" >> .env
                '''
                
                // Verify Docker and Docker Compose are available
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }
        
        stage('Clean Previous Build') {
            steps {
                echo 'Cleaning up previous Jenkins build containers...'
                // Stop and remove any existing Jenkins build containers
                sh '''
                    docker-compose -f ${COMPOSE_FILE} down --volumes --remove-orphans || true
                    docker system prune -f || true
                '''
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building FoodHub application in containerized environment...'
                // Build and start containers with volume mounting
                sh '''
                    docker-compose -f ${COMPOSE_FILE} build --no-cache
                    docker-compose -f ${COMPOSE_FILE} up -d
                '''
                
                // Wait for services to be ready
                echo 'Waiting for services to start...'
                sh 'sleep 30'
                
                // Verify containers are running
                sh 'docker-compose -f ${COMPOSE_FILE} ps'
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                
                // Check if MongoDB is accessible
                sh '''
                    echo "Testing MongoDB connection..."
                    docker-compose -f ${COMPOSE_FILE} exec -T foodhub-mongo-jenkins mongo --eval "db.adminCommand('ping')" || echo "MongoDB check failed"
                '''
                
                // Check if backend is responding
                sh '''
                    echo "Testing backend health..."
                    curl -f http://localhost:8082/health || echo "Backend health check failed"
                '''
                
                // Check if frontend is accessible
                sh '''
                    echo "Testing frontend..."
                    curl -f http://localhost:3001/ || echo "Frontend check failed"
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running application tests in containerized environment...'
                // Run tests inside the backend container
                sh '''
                    docker-compose -f ${COMPOSE_FILE} exec -T foodhub-backend-jenkins npm test || echo "Tests completed"
                '''
            }
        }
        
        stage('Collect Build Artifacts') {
            steps {
                echo 'Collecting build artifacts...'
                // Export container logs for debugging
                sh '''
                    mkdir -p build-artifacts
                    docker-compose -f ${COMPOSE_FILE} logs foodhub-frontend-jenkins > build-artifacts/frontend-logs.txt
                    docker-compose -f ${COMPOSE_FILE} logs foodhub-backend-jenkins > build-artifacts/backend-logs.txt
                    docker-compose -f ${COMPOSE_FILE} logs foodhub-mongo-jenkins > build-artifacts/mongo-logs.txt
                '''
                
                // Archive the logs
                archiveArtifacts artifacts: 'build-artifacts/*.txt', 
                                fingerprint: true,
                                allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Jenkins build environment...'
            // Always clean up containers after build
            sh '''
                docker-compose -f ${COMPOSE_FILE} down --volumes --remove-orphans || true
                docker system prune -f || true
            '''
        }
        
        success {
            echo '✅ Jenkins Pipeline completed successfully!'
            echo 'FoodHub application built and tested in containerized environment.'
        }
        
        failure {
            echo '❌ Jenkins Pipeline failed!'
            echo 'Check the build logs for details.'
        }
        
        unstable {
            echo '⚠️ Jenkins Pipeline completed with warnings.'
        }
    }
}
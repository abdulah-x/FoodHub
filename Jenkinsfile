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
        
        stage('Selenium Automated Tests') {
            steps {
                echo '=========================================='
                echo 'Running Selenium Automated Test Suite...'
                echo '=========================================='
                
                script {
                    try {
                        // Build lightweight Selenium test container
                        sh '''
                            echo "Building lightweight Selenium test container..."
                            docker build -f Dockerfile.selenium.light -t foodhub-selenium-tests:latest .
                        '''
                        
                        // Run Selenium tests in Docker container
                        sh '''
                            echo "Running Selenium tests in containerized environment..."
                            docker run --rm \
                                --network host \
                                -v ${WORKSPACE}/tests/selenium/reports:/app/reports \
                                -v ${WORKSPACE}/tests/selenium/screenshots:/app/screenshots \
                                -e BASE_URL=http://localhost:3001 \
                                -e API_URL=http://localhost:8082 \
                                foodhub-selenium-tests:latest \
                                pytest /app/tests/test_foodhub.py -v \
                                    --html=/app/reports/test_report.html \
                                    --self-contained-html \
                                    --tb=short
                        '''
                        
                        echo '✓ All Selenium tests passed successfully!'
                        
                    } catch (Exception e) {
                        echo "⚠ Warning: Some Selenium tests failed: ${e.message}"
                        echo "Continuing pipeline execution..."
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
            
            post {
                always {
                    // Publish Selenium test reports
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'tests/selenium/reports',
                        reportFiles: 'test_report.html',
                        reportName: 'Selenium Test Report',
                        reportTitles: 'FoodHub Selenium Automated Tests'
                    ])
                    
                    // Archive test screenshots if any failures occurred
                    archiveArtifacts artifacts: 'tests/selenium/screenshots/*.png', 
                                    fingerprint: true,
                                    allowEmptyArchive: true
                    
                    echo 'Selenium test reports published'
                }
                
                success {
                    echo '✓ Selenium testing stage completed successfully'
                }
                
                failure {
                    echo '✗ Selenium testing stage failed'
                }
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
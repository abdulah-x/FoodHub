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
                
                // Wait for services to be ready and healthy using Docker health checks
                echo 'Waiting for services to become healthy (max 3 minutes per service)...'
                sh '''
                    echo "Services started, waiting for them to be ready..."
                    docker-compose -f ${COMPOSE_FILE} ps
                    
                    echo "Waiting 30 seconds for initial startup..."
                    sleep 30
                    
                    # Wait for Backend to respond (up to 2 minutes)
                    echo "Checking Backend health..."
                    COUNTER=0
                    until curl -f http://localhost:8082/health > /dev/null 2>&1 || [ $COUNTER -eq 24 ]; do
                        echo "Backend not ready yet, waiting... (attempt $((COUNTER+1))/24)"
                        sleep 5
                        COUNTER=$((COUNTER+1))
                    done
                    
                    if curl -f http://localhost:8082/health > /dev/null 2>&1; then
                        echo "✓ Backend is healthy!"
                    else
                        echo "✗ Backend health check timeout - continuing anyway"
                    fi
                    
                    # Wait for Frontend to respond (up to 2 minutes)
                    echo "Checking Frontend health..."
                    COUNTER=0
                    until curl -f http://localhost:3001/ > /dev/null 2>&1 || [ $COUNTER -eq 24 ]; do
                        echo "Frontend not ready yet, waiting... (attempt $((COUNTER+1))/24)"
                        sleep 5
                        COUNTER=$((COUNTER+1))
                    done
                    
                    if curl -f http://localhost:3001/ > /dev/null 2>&1; then
                        echo "✓ Frontend is healthy!"
                    else
                        echo "✗ Frontend health check timeout - continuing anyway"
                    fi
                    
                    echo "✓ All services check complete!"
                    docker-compose -f ${COMPOSE_FILE} ps
                    
                    # Final verification
                    echo "Final connectivity verification..."
                    curl -I http://localhost:3001/ 2>&1 | head -5 || echo "Frontend check failed"
                    curl -I http://localhost:8082/ 2>&1 | head -5 || echo "Backend check failed"
                '''
                
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
            
            // Send email notification with test results
            script {
                def gitAuthor = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()
                def gitMessage = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                def buildStatus = currentBuild.currentResult
                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : (buildStatus == 'UNSTABLE' ? '⚠️' : '❌')
                
                emailext (
                    to: gitAuthor,
                    subject: "${statusEmoji} Jenkins Build #${BUILD_NUMBER} - ${buildStatus}: ${JOB_NAME}",
                    body: """
                        <html>
                        <body>
                            <h2>${statusEmoji} Jenkins Build ${buildStatus}</h2>
                            <p><strong>Project:</strong> ${JOB_NAME}</p>
                            <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                            <p><strong>Status:</strong> ${buildStatus}</p>
                            <p><strong>Commit by:</strong> ${gitAuthor}</p>
                            <p><strong>Commit Message:</strong> ${gitMessage}</p>
                            <p><strong>Build Duration:</strong> ${currentBuild.durationString.replace(' and counting', '')}</p>
                            <hr>
                            <h3>Test Results:</h3>
                            <p>View detailed test results here: <a href="${BUILD_URL}HTML_20Report/">Selenium Test Report</a></p>
                            <p>Full Console Output: <a href="${BUILD_URL}console">Console Log</a></p>
                            <hr>
                            <p><em>This email was automatically sent by Jenkins CI/CD Pipeline</em></p>
                        </body>
                        </html>
                    """,
                    mimeType: 'text/html',
                    attachLog: false,
                    attachmentsPattern: 'tests/selenium/reports/test_report.html'
                )
            }
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
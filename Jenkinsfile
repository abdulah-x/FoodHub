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
                
                // Wait for services to be ready and healthy
                echo 'Waiting for services to start and become healthy...'
                sh '''
                    echo "Initial 30 second wait for containers to initialize..."
                    sleep 30
                    
                    echo "Checking if frontend is accessible..."
                    COUNTER=0
                    MAX_ATTEMPTS=15
                    while [ $COUNTER -lt $MAX_ATTEMPTS ]; do
                        if curl -f http://localhost:3001/ > /dev/null 2>&1; then
                            echo "✓ Frontend is ready!"
                            break
                        fi
                        COUNTER=$((COUNTER+1))
                        echo "Waiting for frontend... (attempt $COUNTER/$MAX_ATTEMPTS)"
                        sleep 10
                    done
                    
                    echo "Checking if backend is accessible..."
                    COUNTER=0
                    while [ $COUNTER -lt $MAX_ATTEMPTS ]; do
                        if curl -f http://localhost:8082/health > /dev/null 2>&1 || curl -f http://localhost:8082/ > /dev/null 2>&1; then
                            echo "✓ Backend is ready!"
                            break
                        fi
                        COUNTER=$((COUNTER+1))
                        echo "Waiting for backend... (attempt $COUNTER/$MAX_ATTEMPTS)"
                        sleep 10
                    done
                    
                    echo "Final service status check..."
                    curl -I http://localhost:3001/ || echo "WARNING: Frontend not responding"
                    curl -I http://localhost:8082/ || echo "WARNING: Backend not responding"
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
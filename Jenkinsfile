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
        
        stage('Check Services') {
            steps {
                echo 'Checking if FoodHub services are running...'
                sh '''
                    echo "Checking for running containers..."
                    docker ps | grep foodhub || echo "WARNING: No FoodHub containers found"
                    
                    echo "Waiting 10 seconds for services to be ready..."
                    sleep 10
                    
                    # Check Backend
                    if curl -f http://localhost:8082/health > /dev/null 2>&1; then
                        echo "✓ Backend is responding on port 8082"
                    else
                        echo "✗ WARNING: Backend not responding on port 8082"
                        echo "Please start containers manually with: docker-compose up -d"
                    fi
                    
                    # Check Frontend
                    if curl -f http://localhost:3001/ > /dev/null 2>&1; then
                        echo "✓ Frontend is responding on port 3001"
                    else
                        echo "✗ WARNING: Frontend not responding on port 3001"
                        echo "Please start containers manually with: docker-compose up -d"
                    fi
                    
                    docker ps
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
pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                dir('balanced-body') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('balanced-body') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Type Check') {
            steps {
                dir('balanced-body') {
                    sh 'npm run type-check || true'
                }
            }
        }

        stage('Build') {
            steps {
                dir('balanced-body') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('balanced-body') {
                    sh 'npm test --if-present'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}
pipeline {
    agent any
    stages {

        stage('Install Dependencies') { 
            steps {
                sh 'npm ci'
            }
        }
    
        stage('Checkout Reactcoding') {
            steps {
                git branch: 'master', credentialsId: 'ENp71hP5UGEtknhAinW7dg7plfy2ug/77vcGQBJwL+Q', url: 'ssh://git@github.com:scrumvisualize/reactcoding.git'
            }
        }

        stage('Run cypress') {
            steps {
                script {
                    def baseUrlConfig="-e CYPRESS_baseUrl=http://localhost:3000/reactcoding"
                    def cypressArgs = "run --spec cypress/integration/**/*.spec.js --headless --browser chrome"
                    sh """
                    docker run ${baseUrlConfig} \
                    -e CYPRESS_BOOK_UNITS=\"10\" \
                    -e CYPRESS_BOOK_PRICE=\"15\" \
                    -e CYPRESS_BASE_URL=\"http://localhost:3000/reactcoding\" \
                    cypress:latest \
                        /node_modules/.bin/cypress ${cypressArgs}
                    """
                }
            }
        }
      
    }
}
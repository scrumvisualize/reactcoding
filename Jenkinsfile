pipeline {
     agent {
    // this image provides everything needed to run Cypress test
    docker {
      image 'cypress/base:10'
    }
  }
    stages {
        stage('Build') { 
            steps {
                sh 'npm run build'
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
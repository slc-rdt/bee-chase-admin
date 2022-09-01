pipeline {
  agent any

  environment {
    NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
    NEXT_PUBLIC_BASE_PATH = ''

    BEECHASE_API_URL = 'https://competition.binus.ac.id/beechase-api/api'
    BLUEJACK_API_URL = 'https://bluejack.binus.ac.id/lapi/api'

    NEXTAUTH_SECRET = 'hxh'
    NEXTAUTH_URL = 'http://localhost:3000/api/auth'
  }

  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        pnpm build
      }
    }
    stage('Test') {
      steps {
        echo 'Testing..'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying....'
      }
    }
  }
}

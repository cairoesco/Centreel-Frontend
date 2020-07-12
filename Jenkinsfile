pipeline {
    agent { dockerfile true }
    environment {
        HOME = '.'
    }
    stages {
        stage('Install') { 
            steps {
                sh 'cat /etc/os-release'
                sh 'npm install' 
            }
        }
        stage('Build for dev') {
            when {
                expression {
                    return GIT_BRANCH == 'origin/dev'
                }
            }
            steps {
                sh 'ng build --configuration=dev'
            }
        }
        stage('Build for testing') {
            when {
                expression {
                    return GIT_BRANCH == 'origin/testing'
                }
            }
            steps {
                sh 'ng build --configuration=testing'
            }
        }
        stage('Build for production') {
            when {
                expression {
                    return GIT_BRANCH == 'origin/master'
                }
            }
            steps {
                sh 'ng build --prod'
            }
        }
      	stage('Deploy for dev') {
            when {
                expression {
                    return GIT_BRANCH == 'origin/dev'
                }
            }
            steps {
                sshagent (credentials: ['jenkins-ssh-key']) {
    				sh 'scp -o StrictHostKeyChecking=no -r dist/* root@169.48.27.167:/s3/dev-frontend'
  				}
            }
        }
      stage('Deploy for testing') {
        when {
          expression {
            return GIT_BRANCH == 'origin/testing'
          }
        }
        steps {
          sshagent (credentials: ['jenkins-ssh-key']) { 
            sh 'scp -o "ProxyCommand ssh root@169.48.27.167 -W %h:%p" -o StrictHostKeyChecking="no" -r dist/* root@10.166.99.29:/var/www/html/'
          }
        }
      }
      stage('Deploy for master') {
        when {
          expression {
            return GIT_BRANCH == 'origin/master'
          }
        }
        steps {
          sshagent (credentials: ['jenkins-ssh-key']) { 
            sh 'scp -o "ProxyCommand ssh ubuntu@ec2-35-182-71-226.ca-central-1.compute.amazonaws.com -W %h:%p" -o StrictHostKeyChecking="no" -r dist/* ubuntu@10.0.130.78:/var/www/html/'
          }
        }
      }
    }
}



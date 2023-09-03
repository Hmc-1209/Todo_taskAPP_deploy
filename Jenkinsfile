pipeline {
    agent any

    stages {
        stage('Connect to Remote Host') {
            steps {
                withCredentials([file(credentialsId: 'Todo_taskApp_server_API', variable: 'apiSecretFile'),
                                file(credentialsId: 'Todo_taskApp_server_API_auth', variable: 'authSecretFile')]) {
                    sshagent(['Raspi-dannyho']) {
                        sh '''
                        ssh dannyho@122.116.20.182 "
                            docker stop todo_task_app_api || true
                            docker rm todo_task_app_api || true

                            # Copy the secret files
                            scp $apiSecretFile dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/config.py
                            scp $authSecretFile dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/Authentication/config.py

                            cd ~/Documents/Todo_taskAPP_server
                            git pull
                            cd API
                            docker build -t todo_task_app_api .
                            docker run -d --name todo_task_app_api -p 8002:8002 todo_task_app_api
                            docker prune

                        "
                        '''
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}
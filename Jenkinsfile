pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                withCredentials([file(credentialsId: 'Todo_taskApp_server_API', variable: 'apiSecretFile'),
                                file(credentialsId: 'Todo_taskApp_server_API_auth', variable: 'authSecretFile')]) {
                    sshagent(['Raspi-dannyho']) {
                        sh '''
                        ssh dannyho@122.116.20.182 "
                            docker stop todo_task_app_api || true
                            docker rm todo_task_app_api || true

                            scp $apiSecretFile dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/
                            scp $authSecretFile dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/Authentication

                            cd ~/Documents/Todo_taskAPP_server
                            git pull
                            cd API
                            docker build -t todo_task_app_api .
                            docker run -d --name todo_task_app_api -p 8002:8002 todo_task_app_api
                            docker image prune -f
                        "
                        '''
                    }
                }
            }
        }

        stage('Test') {
            steps {
                sshagent(['Raspi-dannyho']) {
                    sh'''
                    ssh dannyho@122.116.20.182 "
                        echo "Waiting a short period of time to let API start up properly..."
                        sleep 3
                        cd ~/Documents/Todo_taskAPP_server/API/test
                        ./Deploy_test.sh
                    "
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}
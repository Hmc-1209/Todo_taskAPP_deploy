pipeline {
    agent any

    stages {
        stage('Connect to Remote Host') {
            steps {
                sshagent(['Raspi-dannyho']) {
                    sh '''
                    ssh dannyho@122.116.20.182 "
                        if [ \"\$(docker ps -q -f name=todo_task_app_api)\" ]; then
                            docker stop todo_task_app_api
                            docker rm todo_task_app_api
                        elif [ \"\$(docker ps -aq -f name=todo_task_app_api)\" ]; then
                            docker rm todo_task_app_api
                        fi

                        cd ~/Documents/Todo_taskAPP_server/API
                        docker build -t todo_task_app_api .
                        docker run -d --name todo_task_app_api -p 8002:80 todo_task_app_api
                    "
                    '''
                }
            }
        }

        stage('Test') {
            // Put test files here
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

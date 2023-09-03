pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sshagent(['Raspi-dannyho']) {
                    script {
                        def secretFileAPI = credentials('Todo_taskApp_server_API')
                        def secretFileAuth = credentials('Todo_taskApp_server_API_auth')

                        sh "scp ${secretFileAPI} dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/"
                        sh "scp ${secretFileAuth} dannyho@122.116.20.182:~/Documents/Todo_taskAPP_server/API/Authentication/"

                        if (sh(script: """
                            ssh dannyho@122.116.20.182 "
                                if [ \"\$(docker ps -q -f name=todo_task_app_api)\" ]; then
                                    docker stop todo_task_app_api
                                    docker rm todo_task_app_api
                                elif [ \"\$(docker ps -aq -f name=todo_task_app_api)\" ]; then
                                    docker rm todo_task_app_api
                                fi

                                cd ~/Documents/Todo_taskAPP_server/API
                                git pull
                                docker build -t todo_task_app_api .
                                docker run -d --name todo_task_app_api -p 8002:8002 todo_task_app_api
                                docker image prune -y
                            "
                        """.stripIndent()) != 0) {
                            error("Deployment failed")
                        }
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
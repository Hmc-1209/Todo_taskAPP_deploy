## Deploying Todo_taskAPP

##### Contributor : Danny Ho
This project is a Full-Stack website for a ToDo task app. Users are able to create their own repositories and store different datas in them. The constructions are : A mariaDB as database, a FastAPI as communication API, a React app as frontend. All of these are deployed on Raspberry Pi, with database directly installed, API and APP in docker container. They're hosted by Jenkins using pipeline so you'll find a Jenkinsfile below.

#### How to use
If you want to host it on your own server, make sure to do things below :
* Clone the project to your path
* Use `pip install -r requirements.txt` to get all dependencies in path API
* Construct your own database and set the DataBase settings in FastAPI
* Add your own config.py in API folder and API/Authentication folder
* Use `uvicorn main:app` on path API to start the API server
* Use `npm install` to get node modules in path APP
* Use `npm start` to start up the React app  

And you shold be good to go!

#### Policy
1. This web is deployed on Raspberry Pi, so if the server not response as fast as you might think, it's totally normal.
2. You'll have to first create a user, and log in with your username and password. Then you can create a repository to save your things to do. Different repositories are independent from each other, they hold different tasks that makes you able to seperate them.
3. Please maintain good customs. You'll be welcomed as long as you don't break the rules.
4. The url of website : http://122.116.20.182:8003
5. If you would like to fork this project, please give this github page as reference source.
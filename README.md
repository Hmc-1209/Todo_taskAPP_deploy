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

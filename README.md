### Nest websocket project
```
WebSocket Handler for Sensor Data written with Nest.js framework and MongoDB for data storage. It uses CRUD WebSocket handler to manage input from temeprature and himidity sensors.
I used Socket.io for webSocket server to receive sensor data in real-time.
Unit tests are written using Jest to check the main functionalities of the application such as CRUD operations, Service and Gateway connections.
Project is dockerized with Docker-Compose file configuration to run and manage both application and MongoDB container.
```
## Run project with docker
```
To build and run project with Docker run command: 'docker-compose up --build'

To run project: 'docker-compose up -d'

To check container logs: 'docker-compose logs -f'

To stop containers: 'docker-compose down'
```

## Run unit Tests Project
```
To run unit tests use command: 'npm run test'
```

## Code guide
```

Node version 20.
Build project with Docker
.env file is required and should be placed into root folder.
```
## .env.example file schema
```
DB_URL=mongodb://mongodb:27017/sensor_data
DB_PORT=27017:27017
PORT=3000
APP_PORT=3000:3000
APP_NAME=Nest-app
DB_NAME=mongodb
DB_VOLUME=data/db
```

### Socket events
```
insertData (POST) - Insert item into db
getAllData (GET) - Get all data from db
getDataById (GET) - Get item from db based on ID
updateData (PUT) - Update existing item in db based on ID
deleteData' (DELETE) - Delete item from db based on ID

Check service.ts file and others for more details
```

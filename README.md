### Nest websocket project
```
WebSocket Handler for Sensor Data written with Nest.js framework and MongoDB for data storage. It uses CRUD WebSocket handler to manage input from temeprature and himidity sensors. 

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
## .ENV file schema
```
DB_URL=
DB_PORT=
PORT=
APP_PORT=
APP_NAME=
DB_NAME=
DB_VOLUME=
TEST_NAME=
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

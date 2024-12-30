# endpoint-response-override
A simple tool which allows you to override the endpoint responses of your express server.
It is useful when you want to test the front end behaviour based on different server responses. for example you can use it to test the NextJs server side rending scenarios.

## usage 
### setup
setup example (for details check [example folder](example/server.js)]):
```
const jsonServer = require('json-server');
const initialData = require('./db.json');
const { overrideRouter, responseOverrideMiddleware } = require('endpoint-response-override');

const server = jsonServer.create();

const router = jsonServer.router(initialData);

const middlewares = jsonServer.defaults();

// here to add override middleware
server.use(responseOverrideMiddleware);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// add the override route
server.use('/override', overrideRouter);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
```
### register endpoint response
POST /override/register
body: 
```
{
    "url": "/users",
    "method": "GET",
    "response": {
        "status": 200,
        "body": {
            "name": "batman"
        }
    }
}
```
response status code: 200
After this when you call GET /users, then the server will return status 200 with body
```
{
    "name" : "batman"
}
```

### clear the override response
POST /overide/reset
response status code: 200
This endpoint will clear all the override responses.

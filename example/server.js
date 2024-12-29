const jsonServer = require('json-server');
const initialData = require('./db.json');
const { overrideRouter, responseOverrideMiddleware } = require('../index');

const server = jsonServer.create();

const router = jsonServer.router(initialData);

const db = router.db;
console.log(db.getState());

const middlewares = jsonServer.defaults();

server.use(responseOverrideMiddleware);
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use('/override', overrideRouter);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
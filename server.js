const http = require('http');
const app = require('./app');
const urlAndPorts = require('./config/urlAndPorts');

const port = urlAndPorts.serverPort;

const server = http.createServer(app);
server.listen(port);

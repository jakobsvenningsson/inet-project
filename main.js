/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const debug = require('debug')('debug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

const db = require('./src/server/sequelize.js');

require('./src/server/passport.js')(passport);

app.use(passport.initialize());

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.Server(app);
const io = require('socket.io').listen(server);

const routes = require('./src/server/routes/index.routes.js')(io);
app.use('/api', routes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


var socketController = require('./src/server/socketController.js');
io.on('connection', function (socket) {
  debug("new socket connection!");
  socketController(socket, io);
});

server.listen(port, () => debug(`API running on localhost:${port}`));

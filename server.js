/*jshint esversion: 6 */
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');
const sharedSession = require('express-socket.io-session');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
var session = expressSession({
    secret: "MoveFromHereOrTheSecretWillBeOnGit",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

module.db = require('./src/server/sequelize.js');
module.userModel = require('./src/server/models/user.js')(module.db.sequelize, module.db.Sequelize);
module.stockModel = require('./src/server/models/stock.js')(module.db.sequelize, module.db.Sequelize);
module.commentModel = require('./src/server/models/comment.js')(module.db.sequelize, module.db.Sequelize);

module.passport = passport;


require('./src/server/passport.js')(passport);

app.use(passport.initialize());

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.Server(app);
const io = require('socket.io').listen(server);
module.io = io;
io.use(sharedSession(session));

const routes = require('./src/server/routes.js');
app.use('/api', routes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


var socketController = require('./src/server/socketController.js');
io.on('connection', function (socket) {
  console.log("new socket connection!");
  socketController(socket, io);
  io.on('disconnect', function(){
    console.log("disconnect!");
  });
});


server.listen(port, () => console.log(`API running on localhost:${port}`));

/* jslint node: true */
"use strict";

var debug = require('debug')('debug');

module.exports = function (socket, io) {
  socket.on('join',function(data){
    debug("Someone has joined room: " + data.stock);
    socket.join(data.stock);
  });
  socket.on('startTyping',function(data){
    debug("someone's typing");
    debug(data);
    io.to(data.stock).emit('startTyping',{name:data.name, email:data.email, id:data.id});
  });
  socket.on('stopTyping',function(data){
    debug("someone stopped typing");
    debug(data);
    io.to(data.stock).emit('stopTyping',{name:data.name, email:data.email, id:data.id});
  });
  io.on('disconnect', function(){
    debug("disconnect!");
  });
};

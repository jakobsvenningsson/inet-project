/* jslint node: true */
"use strict";

module.exports = function (socket, io) {
  socket.on('join',function(data){
    console.log("Someone has joined room: " + data.stock);
    socket.join(data.stock);
  });
  socket.on('startTyping',function(data){
    console.log("someone's typing");
    console.log(data);
    io.to(data.stock).emit('startTyping',{name:data.name, email:data.email, id:data.id});
  });
  socket.on('stopTyping',function(data){
    console.log("someone stopped typing");
    console.log(data);
    io.to(data.stock).emit('stopTyping',{name:data.name, email:data.email, id:data.id});
  });
};

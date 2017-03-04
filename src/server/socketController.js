/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

var http = require('http');
var debug = require('debug')('debug');

var intervalEmit = {};
var listeners = {};

module.exports = function (socket, io) {
  socket.on('join',function(data){
    debug("Someone has joined room: " + data.channel);
    socket.join(data.channel);
  });

  socket.on('startStream', function(data){
    debug("starting stream to room: " + data.channel);
    socket.join(data.channel);
    if(listeners.hasOwnProperty(data.channel)){
      listeners[data.channel] = listeners[data.channel] + 1;
    } else {
      listeners[data.channel] = 1;
    }
    debug("Listeners in room: " + listeners[data.channel]);
    if(!intervalEmit.hasOwnProperty(data.channel)){
      intervalEmit[data.channel] = setInterval(function () {
        console.log("EMIT DATA");
          getStockData(data);
      }, 4000);
    }
  });

  socket.on('endStream', function(data){
    debug("Leaving stream: " + data.channel);
    listeners[data.channel] = listeners[data.channel] - 1;
    if(listeners[data.channel] === 0){
      debug("delete room");
      clearInterval(intervalEmit[data.channel]);
      delete intervalEmit[data.channel];
      delete listeners[data.channel];
    }
    debug("Listeners in room: " + listeners[data.channel]);
    socket.leave(data.channel);
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

  socket.on('joinFavorites',function(user){
    console.log("Someone has joined favorites room");
    socket.join(user.id);
  });

  function getStockData(data){
    http.get({
      host:'marketdata.websol.barchart.com',
      path:`/getQuote.json?key=c678bb4aae1f39d459eee48aeca6fa78&symbols=${data.channel}`
    }, (response)=>{
      var str = '';
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', (chunk)=>{
        str += chunk;
      });
      //the whole response has been recieved, so we just print it out here
      response.on('end', ()=>{
        //debug(str);
        io.to(data.channel).emit('newSocketData', str);
      });
    });
  }
};

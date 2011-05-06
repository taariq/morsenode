
var express = require('express'),
    app = express.createServer(),
    stylus = require('stylus'),
    port = 3000;// by default it's 3000. In production it's 80

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

function setupStylus(){
 // Setup Stylus to compile files on change
  function compile(str, path, fn) {
    stylus(str)
      .set('filename', path)
      .set('compress', true)
      .render(fn);
  }
  app.use(stylus.middleware({ src: __dirname + '/www' }));
}

app.configure('development', function(){
    setupStylus();
    app.use(express.static(__dirname + '/www'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  port = 80;
  console.log('Running in Production Mode');
  setupStylus();   
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/www', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.listen(80);

// setup socket io logic.
var io = require('socket.io');

var socket = io.listen(app); 

socket.on('connection', function(client){
 
  // new client is here! 
  client.on('message', function(msg){ 

    client.broadcast(msg);
  });
  
  client.on('disconnect', function(){
  }); 
}); 

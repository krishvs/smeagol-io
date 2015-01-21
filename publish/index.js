var app = require('http').createServer(handler),
    amqp = require('amqplib'),
    io = require('socket.io')(app),
    redis = require('redis'),
    socket_redis = require('socket.io-redis'),
    user_module = require(process.argv[1].toString());
    config = require(process.argv[2].toString())["publisher"];
var qname = '';
var rabbit_connection = null;



function init(beforeInitFilter,redis_config){
  io.adapter(socket_redis(config['redis_socket']));
}

function handler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Guest, How Can I help You?');
};

function start(){
  console.log('Starting publisher ');
  app.listen(process.env.NODE_PORT || 8001);
  socketEvents = user_module.socketEvents;
  if(socketEvents){
    socketEvents(io,"");
    console.log('The valeu of the config is ',config);
  }
};

module.exports.init = init;
module.exports.io = io;
module.exports.start = start;

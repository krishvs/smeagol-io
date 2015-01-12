var app = require('http').createServer(handler),
    amqp = require('amqplib'),
    io = require('socket.io')(app),
    redis = require('redis'),
    socket_redis = require('socket.io-redis')
var qname = '';
var rabbit_connection = null;

function init(beforeInitFilter,redis_config){
  io.adapter(socket_redis(config['redis_socket']));
}

function handler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Guest, How Can I help You?');
};

function startPublisher(ch){
  util.log('Starting publisher '+ch);
  app.listen(process.env.NODE_PORT || 8001);
};

module.exports.init = init;
module.exports.io = io;
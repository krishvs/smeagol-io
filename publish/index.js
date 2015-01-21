var app = require('http').createServer(handler),
    amqp = require('amqplib'),
    io = require('socket.io')(app),
    redis = require('redis'),
    when = require('when'),
    socket_redis = require('socket.io-redis'),
    user_module = require(process.argv[1].toString());
    config = require(process.argv[2].toString())["publisher"];
var qname = '';
var rabbit_connection = null;

if(config['redis_socket']){
  io.adapter(socket_redis(config['redis_socket']));
}


function handler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Guest, How Can I help You?');
};

function startPublisher(connection){
  console.log('Starting publisher ');
  app.listen(process.env.NODE_PORT || 8001);
  console.log('Listening');
  socketEvents = user_module.socketEvents;
  if(socketEvents){
    socketEvents(io,connection);
  }
}

function start(){
  amqp.connect(config['rabbitmq']['connection']['url_option']['url']).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {

      var ok = ch.assertExchange(config['rabbitmq']['connection']['auth_exchange_options']['defaultExchangeName'], 'topic', { durable : true, autoDelete : false });

      ok = ok.then(function() {
        return ch.assertQueue('', {exclusive: true, "x-expires": "1800000"});
      });

      ok = ok.then(function(qok) {

        qname = qok.queue;
        return ch.bindQueue(qok.queue, config['rabbitmq']['connection']['auth_exchange_options']['defaultExchangeName'], '').then(function() {
          return qok.queue;
        });

      });

      ok = ok.then(function(queue) {

        return ch.consume(queue, processMessage, {noAck: true});

      });

      function processMessage(msg) {
        var data = JSON.parse(msg.content.toString());
        user_module.processMessage(msg,ch);
      }

      return ok.then(function() {
        rabbit_connection = ch;
        startPublisher(ch);
      });
    }))
  }).then(null, console.warn);
};

module.exports.io = io;
module.exports.start = start;

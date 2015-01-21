var amqp = require('amqplib'),
    when = require('when'),
    util = require('util');

var Poller = function(url_options,exchange_name,exchange_type,routing_key,queue_name){
  this.url_options = url_options;
  this.exchange_name = exchange_name;
  this.exchange_type = exchange_type;
  this.routing_key = routing_key;
  this.queue_name = queue_name;
  this.poll();
};

Poller.prototype.poll = function(){
  var self = this;

  amqp.connect(this.url_options).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
      var ok = ch.assertExchange(self.exchange_name, self.exchange_type, { durable : true, autoDelete : false })
      ok = ok.then(function() {
        return ch.assertQueue(self.queue_name);
      });

      ok = ok.then(function(qok) {
        qname = qok.queue;
        return ch.bindQueue(qok.queue, self.exchange_name, self.routing_key).then(function() {
          return qok.queue;
        });
      });
      ok = ok.then(function(queue) {
        return ch.consume(queue, process, {noAck: true});
      });
      ok.then(function() {
        util.debug(' [*] Waiting for logs');
      });

      function process(msg) {
        util.debug(" [x] "+msg.content.toString());
        self.processMessage(JSON.parse(msg.content.toString()),ch);
      }
      return ok
    }))
  });

};
module.exports.poller = Poller;
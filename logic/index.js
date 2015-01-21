var Poller = require('../base').poller,
  crypto = require('crypto'),
  when = require('when'),
  config = require(process.argv[2].toString())["logic"],
  user_module = require(process.argv[1].toString()),
  util = require('util');

function start(){
  if(user_module.processMessage){
    Poller.prototype.processMessage = user_module.processMessage;
  }
  var authPoller = new Poller(config['rabbitmq']['connection']['url_option']['url'],config["auth_server"]["exchange_name"],'topic', config["auth_server"]["routing_key"],config["auth_server"]["queue_name"]);
}

module.exports.start = start;
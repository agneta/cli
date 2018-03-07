const terminal = global.requireMain('server/terminal');

module.exports = function() {

  var options = {};

  require('./config')()
    .then(function(config) {
      options.config = config;
      return require('./output')(options);
    })
    .then(function() {
      return require('./secrets')(options);
    })
    .then(function() {
      return require('./git')(options);
    })
    .then(function() {
      return require('../image/init').promise();
    })
    .then(function() {
      return require('./platform')(options);
    })
    .then(function() {
      return terminal();
    })
    .then(function(servers) {
      options.servers = servers;
    })
    .then(function() {
      return require('./email')(options);
    })
    .then(function() {
      return require('./administrator')(options);
    })
    .then(function() {
      return require('./icons')(options);
    })
    .then(function() {
      return require('./generate')(options);
    })
    .then(function() {
      console.log('Your project is ready');
      process.exit();
    })
    .catch(function(error) {
      console.error(error);
    });

};

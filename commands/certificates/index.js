const client = require('./level/client');
const server = require('./level/server');
const authority = require('./level/authority');

module.exports = function() {

  var options = require('./options')();

  return Promise.resolve()
    .then(function() {

      return authority(options);

    })
    .then(function() {

      return server(options);

    })
    .then(function() {

      return client(options);

    })
    .then(function() {

      return require('./output')(options);

    })
    .then(function() {
      console.log('Certificates are exported');
    });

};

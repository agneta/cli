module.exports = function() {

  return Promise.resolve()
    .then(function() {
      return require('agneta-platform/main/server/terminal')();
    })
    .then(function(servers) {
      return require('./dependencies')(servers);
    });

};

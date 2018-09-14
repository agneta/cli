const proc = require('../../../lib/process');

module.exports = function() {
  return Promise.resolve()
    .then(function() {
      return require('../../secret/key/get').promise();
    })
    .then(function(secretKey) {
      return proc.spawn(
        `docker-compose run -e AGNETA_SECRET_KEY=${secretKey} build`
      );
    });
};

const Promise = require('bluebird');
const pm2 = require('pm2');
const config = require('../lib/config');

function tail(exclusive) {
  return Promise.resolve()

    .then(function() {
      pm2.streamLogs(config.processName, 1000, true, '', exclusive);
    })
    .catch(console.error);
}

module.exports = {
  output: function() {
    tail('out');
  },
  errors: function() {
    tail('err');
  }
};

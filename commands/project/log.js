const Promise = require('bluebird');
const pm2 = require('pm2');


function tail(exclusive) {


  return Promise.resolve()

    .then(function() {

      pm2.streamLogs('agneta', 1000, false,'',exclusive);

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

const pm2 = require('pm2');
const Promise = require('bluebird');

function promise() {
  var name = 'agneta';

  return Promise.resolve()
    .then(function() {
      return new Promise(function(resolve, reject) {
        pm2.describe(name, function(err, result) {
          if (err) {
            reject(err);
          }

          resolve(result);
        });
      });
    })
    .then(function(result) {
      if (!result[0]) {
        console.log('Process is not running');
        return;
      }

      return new Promise(function(resolve, reject) {
        pm2.delete(name, function(err, list) {
          if (err) {
            reject(err);
          }

          resolve(list);
        });
      }).then(function() {
        console.log('process stopped');
      });
    });
}

module.exports = {
  promise: promise,
  command: function() {
    promise()
      .then(function() {
        process.exit();
      })
      .catch(console.error);
  }
};

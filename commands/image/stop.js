const proc = require('../../lib/process');


function promise() {

  return proc.exec('docker-compose stop portal');

}

module.exports = {
  cmd: function() {
    promise();
  },
  promise: promise
};

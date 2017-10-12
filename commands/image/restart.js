const proc = require('../../lib/process');

module.exports = function() {

  proc.exec('docker-compose restart dev');

};

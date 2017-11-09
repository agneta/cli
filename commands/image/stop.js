const proc = require('../../lib/process');


function promise(argv) {

  return proc.exec(`docker-compose stop ${argv.service}`);

}

module.exports = {
  cmd: function(argv) {

    promise(argv);
  },
  promise: promise
};

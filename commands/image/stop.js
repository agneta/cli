/**
 * @Author: raphael
 * @Date:   2017-11-09T11:58:34+02:00
 * @Last modified by:   raphael
 * @Last modified time: 2017-12-10T12:09:49+02:00
 */

const proc = require('../../lib/process');

function promise(argv) {
  return proc.exec(`docker-compose kill ${argv.service}`);
}

module.exports = {
  cmd: function(argv) {
    promise(argv);
  },
  promise: promise
};

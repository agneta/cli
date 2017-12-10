const proc = require('../../lib/process');
const Promise = require('bluebird');

module.exports = function(argv) {

  var terminal = `x-terminal-emulator -e "docker-compose exec ${argv.service} bash -c  '`;
  var ending = '\'; bash"';

  return Promise.resolve()
    .then(function() {
      return require('../../lib/check')();
    })
    .then(function() {
      return require('./init').promise();
    })
    .then(function() {
      return proc.spawn(`docker-compose up -d --force-recreate ${argv.service}`);
    })
    .then(function() {
      console.log('Waiting for application to start...');
      return Promise.delay(5000);
    })
    .then(function() {

      proc.exec(`${terminal}agneta process list; exec /bin/bash -i${ending}`);
      proc.exec(`${terminal}tail -n 1000 -f ~/.pm2/logs/agneta-output-0.log${ending}`);
      proc.exec(`${terminal}tail -n 1000 -f ~/.pm2/logs/agneta-error-0.log${ending}`);
    });


};

const proc = require('../../lib/process');

module.exports = function(argv) {

  return Promise.resolve()
    .then(function() {
      return require('./init').promise();
    })
    .then(function() {
      return proc.exec(`docker-compose up -d --force-recreate ${argv.service}`);
    })
    .then(function() {

      var terminal = `x-terminal-emulator -e "docker-compose exec ${argv.service} bash -c  '`;
      var ending = '\'; bash"';
      proc.exec(`${terminal}tail -n 1000 -f ~/.pm2/logs/agneta-output-0.log${ending}`);
      proc.exec(`${terminal}tail -n 1000 -f ~/.pm2/logs/agneta-error-0.log${ending}`);
      proc.exec(`${terminal}agneta process list; exec /bin/bash -i${ending}`);
    });

};

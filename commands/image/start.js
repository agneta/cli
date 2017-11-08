const proc = require('../../lib/process');

module.exports = function() {

  proc.exec('docker-compose up -d --force-recreate dev')
    .then(function() {

      var terminal = 'x-terminal-emulator -e "docker-compose exec dev bash -c  \'';
      var ending = '\'; bash"';
      proc.exec(`${terminal}tail -n 1000 -f .pm2/logs/output-0.log${ending}`);
      proc.exec(`${terminal}tail -n 1000 -f .pm2/logs/error-0.log${ending}`);
      proc.exec(`${terminal}agneta process list; exec /bin/bash -i${ending}`);
    });

};

var forever = require('forever');
var path = require('path');
var serverUid = 'agnetaServer';
var serverScript = path.join(global.pathMain, 'lib/server.js');

forever.config.set('columns', ['uid', 'forever', 'pid', 'uptime']);

module.exports = function(yargs) {

  yargs
    .command('server', 'Preview, edit or even manage your project', function(yargs) {

      yargs.command('start', 'Run in the background', function() {

        logAction('Starting');
        start();

      })
        .command('stop', 'Stop from running in the background', function() {

          logAction('Stopping');
          stop();

        })
        .command('restart', '', function() {

          logAction('Restarting');

          stop();
          setTimeout(start, 1000);
        })
        .command('log', 'View the log files', function() {

          forever.tail(serverScript, {
            length: 100,
            stream: true
          }, function(err, data) {
            console.log(data.line);
          });

        })
        .command('list', 'Preview, edit or even manage your project', function() {

          forever.list(true, function(err, data) {
            if (!data) {
              console.log('Agneta services have stopped');
              return;
            }
            process.stdout.write(data);
            console.log();
            console.log();
          });

        });
    });

  function start() {

    forever.list(false, function(err, data) {

      if (data) {
        for (var instance of data) {
          if (instance.cwd == process.cwd()) {
            console.warn('Already running in the background');
            return;
          }
        }
      }

      forever.startDaemon(serverScript, {
        uid: serverUid,
        max: 10,
        killTree: true,
      });

    });

  }

  function stop() {

    forever.list(false, function(err, data) {

      if (!data) {
        console.log('Server not running');
        return;
      }

      forever.stopAll();
    });

  }

  function logAction(text) {
    console.log(text + ' the server...');
    console.log('View the log for details with the following command:');
    console.log('agneta log');
    console.log();
  }

};

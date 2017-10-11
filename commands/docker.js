const proc = require('../lib/process');
const fs = require('fs-extra');
const S = require('string');
const path = require('path');
const Promise = require('bluebird');
const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = function(yargs) {

  yargs
    .command('docker', 'Run docker commands', function(yargs) {

      var pathPkgLock = 'package-lock.json';
      var pathPkgLockTmp = 'tmp/package-lock.json';

      yargs.command('build', 'Build the docker image', function() {

        var CONTAINER_NAME = path.parse(process.cwd()).name;
        CONTAINER_NAME = S(CONTAINER_NAME).replaceAll('-', '').s;
        CONTAINER_NAME += '_dev';
        CONTAINER_NAME = CONTAINER_NAME.toLowerCase();

        var CACHE_NAME = '.npm-cache.tgz';

        Promise.resolve()
          .then(function() {
            return fs.ensureDir('tmp');
          })
          .then(function() {

            if (!fs.existsSync(pathPkgLock)) {
              return;
            }

            return fs.readFile(pathPkgLock)
              .then(function(content) {
                if (!content.length) {
                  return fs.remove(pathPkgLock);
                }
              });

          })
          .then(function() {

            if (!fs.existsSync(pathPkgLock)) {
              console.log(`Init empty ${pathPkgLock}`);
              return fs.writeFile(pathPkgLock, '{}');
            }

          })
          .then(function() {
            // Init empty cache file
            if (!fs.existsSync(CACHE_NAME)) {

              console.log(`Init empty ${CACHE_NAME}`);
              return proc.exec(`tar cvzf ${CACHE_NAME} --files-from /dev/null`);

            }

          })
          .then(function() {
            return proc.spawn('docker-compose build dev');
          })
          .then(function() {
            console.log('Extracting package-lock.json');
            return proc.exec(`docker run --rm --entrypoint cat ${CONTAINER_NAME}:latest /tmp/package-lock.json > tmp/package-lock.json`,{
              silent: true
            });
          })
          .then(function() {

            if (!fs.existsSync(pathPkgLockTmp)) {
              return;
            }

            var source = fs.readFileSync(pathPkgLock);
            var target = fs.readFileSync(pathPkgLockTmp);

            if (source != target) {
              console.log('Saving NPM cache');

              proc.exec(`docker run --rm --entrypoint tar ${CONTAINER_NAME}:latest czf - /.cache/npm/ > ${CACHE_NAME}`,{
                silent: true
              })
                .then(function() {
                  console.log('Saving package-lock.json');
                  if (!fs.existsSync(pathPkgLockTmp)) {
                    return;
                  }
                  return fs.copy(pathPkgLockTmp, pathPkgLock);

                });
            }

          })
          .then(function() {

            //run cleanup commands so you don't amass images that you don't need
            console.log('Cleanup images');
            return proc.exec('docker rm -v $(docker ps -a -q -f status=exited) 2>&1')
              .then(function() {
                return proc.exec('docker rmi $(docker images -f "dangling=true" -q) 2>&1');
              });

          })
          .then(function() {
            console.log();
            console.log(chalk.bold.green('Success!'));
          });
      });

      yargs.command('run', 'Run the portal', function() {

        proc.exec('docker-compose up -d dev')
          .then(function() {

            var terminal = 'x-terminal-emulator -e "docker-compose exec dev bash -c';

            proc.exec(`${terminal} 'tail -n 1000 -f .pm2/logs/output-0.log'"`);
            proc.exec(`${terminal} 'tail -n 1000 -f .pm2/logs/error-0.log'"`);
            proc.exec(`${terminal} 'pm2 list; exec /bin/bash -i'"`);
          });

      });

      yargs.command('stop', 'Run the services', function() {});

    });
};

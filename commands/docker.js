const exec = require('../lib/exec');
const fs = require('fs-extra');
const S = require('string');
const path = require('path');
module.exports = function(yargs) {

  yargs
    .command('docker', 'Run docker commands', function(yargs) {

      var pathPkgLock = 'package-lock.json';
      var pathPkgLockTmp = 'tmp/package-lock.json';

      yargs.command('build', 'Build the docker image', function() {

        var CONTAINER_NAME = path.parse(path.resolve(process.cwd(),'..')).name;
        CONTAINER_NAME = S(CONTAINER_NAME).replaceAll('-','').s;
        CONTAINER_NAME += '_dev';

        var CACHE_NAME = '.npm-cache.tgz';

        Promise.resolve()
          .then(function() {

            if(!fs.existsSync(pathPkgLock)){
              console.log(`Init empty ${pathPkgLock}`);
              return fs.writeFile(pathPkgLock,null);
            }
          })
          .then(function() {
            // Init empty cache file
            if (!fs.existsSync(CACHE_NAME)) {

              console.log(`Init empty ${CACHE_NAME}`);
              return exec.run(`tar cvzf ${CACHE_NAME} --files-from /dev/null`);

            }

          })
          .then(function(){
            return exec.run('docker-compose build dev');
          })
          .then(function(){
            return exec.run(`docker run --rm --entrypoint cat ${CONTAINER_NAME}:latest /tmp/package-lock.json > tmp/package-lock.json`);
          })
          .then(function() {

            if(!fs.existsSync(pathPkgLockTmp)){
              return;
            }

            var source = fs.readFileSync(pathPkgLock);
            var target = fs.readFileSync(pathPkgLockTmp);

            if (source != target) {
              console.log('Saving NPM cache');

              exec.run(`docker run --rm --entrypoint tar ${CONTAINER_NAME}:latest czf - /.cache/npm/ > ${CACHE_NAME}`)
                .then(function() {
                  console.log('Saving package-lock.json');

                  return fs.copy(pathPkgLockTmp, pathPkgLock);

                });
            }

          });

      });

      yargs.command('run', 'Run the portal', function() {

        exec.run('docker-compose up -d dev')
        .then(function(){

          var terminal = 'x-terminal-emulator -e "docker-compose exec dev bash -c';

          exec.run(`${terminal} 'tail -n 1000 -f .pm2/logs/output-0.log'"`);
          exec.run(`${terminal} 'tail -n 1000 -f .pm2/logs/error-0.log'"`);
          exec.run(`${terminal} 'pm2 list; exec /bin/bash -i'"`);
        });

      });

      yargs.command('stop', 'Run the services', function() {});

    });
};

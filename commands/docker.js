const exec = require('../lib/exec');
const fs = require('fs-extra');
module.exports = function(yargs) {

  yargs
    .command('docker', 'Run docker commands', function(yargs) {

      var pathPkgLock = 'package-lock.json';

      yargs.command('build', 'Build the docker image', function() {

        var CONTAINER_NAME = 'edaaweb_dev';
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
            return exec.run(`docker run --rm --entrypoint cat ${CONTAINER_NAME}:latest /tmp/package-lock.json > /tmp/package-lock.json`);
          })
          .then(function() {

            var source = fs.readFileSync(pathPkgLock);
            var target = fs.readFileSync('/tmp/package-lock.json');

            if (source != target) {
              console.log('Saving NPM cache');

              exec.run(`docker run --rm --entrypoint tar ${CONTAINER_NAME}:latest czf - /.cache/npm/ > ${CACHE_NAME}`)
                .then(function() {
                  console.log('Saving package-lock.json');

                  return fs.copy('/tmp/package-lock.json', pathPkgLock);

                });
            }

          })
          .then(function() {

            //run cleanup commands so you don't amass images that you don't need

            return exec.run('docker rm -v $(docker ps -a -q -f status=exited) 2>&1')
            .then(function(){
              return exec.run('docker rmi $(docker images -f "dangling=true" -q) 2>&1');
            });

          });


      });

      yargs.command('run', 'Run the portal', function() {

      });

      yargs.command('stop', 'Run the services', function() {});

    });
};

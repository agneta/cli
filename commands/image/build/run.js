const fs = require('fs-extra');
const Promise = require('bluebird');
const proc = require('../../../lib/process');

const pathPkgLock = 'package-lock.json';
const pathPkgLockTmp = 'tmp/package-lock.json';
const config = require('./config');

module.exports = function() {


  return Promise.resolve()
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
        return fs.outputFile(pathPkgLock, '{}');
      }

    })
    .then(function() {
      // Init empty cache file
      if (!fs.existsSync(config.path.npmCache)) {

        console.log(`Init empty ${config.path.npmCache}`);
        return proc.exec(`tar cvzf ${config.path.npmCache} --files-from /dev/null`);

      }

    })
    .then(function() {

      return require('../../secrets/key').promise();

    })
    .then(function(secretKey) {
      return proc.spawn(`docker-compose build --build-arg AGNETA_SECRET_KEY=${secretKey} dev`);
    })
    .then(function() {
      console.log('Extracting package-lock.json');
      return proc.exec(`docker run --rm --entrypoint cat ${config.image} /tmp/package-lock.json > tmp/package-lock.json`,{
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

        return proc.exec(`docker run --rm --entrypoint tar ${config.image} czf - /.cache/npm/ > ${config.path.npmCache}`,{
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

    });
    /*
    .then(function() {

      //run cleanup commands so you don't amass images that you don't need
      console.log('Cleanup images');
      return proc.exec('docker rm -v $(docker ps -a -q -f status=exited) 2>&1')
        .then(function() {
          return proc.exec('docker rmi $(docker images -f "dangling=true" -q) 2>&1');
        });

    });*/
};

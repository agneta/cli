const fs = require('fs-extra');
const S = require('string');
const path = require('path');
const Promise = require('bluebird');
const proc = require('../../lib/process');

const pathPkgLock = 'package-lock.json';
const pathPkgLockTmp = 'tmp/package-lock.json';

module.exports = function() {

  var CONTAINER_NAME = path.parse(process.cwd()).name;
  CONTAINER_NAME = S(CONTAINER_NAME).replaceAll('-', '').s;
  CONTAINER_NAME += '_dev';
  CONTAINER_NAME = CONTAINER_NAME.toLowerCase();

  var CACHE_NAME = '.npm-cache.tgz';

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

    });
};

const klaw = require('klaw');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function(options) {

  var sourceDir = path.join(__dirname, '../template');
  var destDir = process.cwd();

  return Promise.resolve()
    .then(function() {

      return new Promise(function(resolve, reject) {

        var walker = klaw(sourceDir);
        var promises = [];

        walker.on('data', function(item) {

          var promise = Promise.resolve()
            .then(function() {

              var location = path.relative(sourceDir, item.path);
              var locationTarget = path.join(destDir, location);

              if (item.stats.isDirectory()) {

                return fs.ensureDir(locationTarget);

              }

              if (item.stats.isFile()) {

                //console.log(location);

                if (options.config.templates[location]) {
                  return fs.readFile(item.path)
                    .then(function(content) {
                      content = _.template(content)(options);
                      return fs.outputFile(locationTarget, content);
                    });
                }

                return fs.exists(locationTarget)
                  .then(function(exists) {
                    if (exists) {
                      return;
                    }
                    return fs.copy(item.path, locationTarget);
                  });
              }


            });

          promises.push(promise);
        });

        walker.on('end', function() {
          Promise.all(promises)
            .then(resolve)
            .catch(reject);
        });
      });
    });

};

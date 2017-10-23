const fs = require('fs-extra');
const path = require('path');

module.exports = function() {

  require('./ssh')()
    .then(function() {
      return require('./git')();
    })
    .then(function() {

      var secret = process.env.AGNETA_SECRET_KEY;

      return fs.outputFile(
        path.join(
          process.cwd(),
          '../secret.json'
        ), secret
      );

    });

};

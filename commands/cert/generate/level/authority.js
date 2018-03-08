const exec = require('child-process-promise').exec;
const fs = require('fs-extra');
const _ = require('lodash');
module.exports = function(options) {

  if (fs.existsSync(options.authDir)) {
    return;
  }

  return Promise.resolve()
    .then(function() {

      return fs.readFile(options.cnfAuth);
    })
    .then(function(data) {

      return fs.outputFile(
        options.authCNF,
        _.template(data)(options.config.authority)
      );

    })
    .then(function() {

      console.log('Create a new certificate authority');
      console.log(`openssl req -new -x509 -days 9999 -config ${options.authCNF} -keyout ${options.authKEY} -out ${options.authCRT}`);
      return exec(`openssl req -new -x509 -days 9999 -config ${options.authCNF} -keyout ${options.authKEY} -out ${options.authCRT}`);

    });

};

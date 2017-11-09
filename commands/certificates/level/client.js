const path = require('path');
const exec = require('child-process-promise').exec;
const fs = require('fs-extra');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function(options) {

  var names = _.keys(options.config.client);
  var template;

  return Promise.resolve()
    .then(function() {

      return fs.readFile(options.clntCNF);
    })
    .then(function(data) {

      template = _.template(data);

    })
    .then(function() {

      return Promise.map(names, function(name) {

        var clientConfig = options.config.client[name];

        var clntDir = path.join(options.clntRoot, name);
        var clntCSR = path.join(clntDir, `${name}-csr.pem`);
        var clntCRT = path.join(clntDir, `${name}-crt.pem`);
        var clntKEY = path.join(clntDir, `${name}-key.pem`);
        var clntPFX = path.join(clntDir, `${name}.pfx`);
        var clntCNF = path.join(clntDir, `${name}.cnf`);

        if (fs.existsSync(clntDir)) {
          return;
        }

        return Promise.resolve()
          .then(function() {
            return fs.outputFile(
              clntCNF,
              template(clientConfig)
            );
          })
          .then(function() {

            console.log('Generate a private key for the client.');
            return exec(`openssl genrsa -out ${clntKEY} 4096`);

          })
          .then(function() {

            console.log('Generate the certificate signing request for the client.');
            return exec(`openssl req -new -config ${clntCNF} -key ${clntKEY} -out ${clntCSR}`);

          })
          .then(function() {

            console.log('Sign the request.');
            return exec(`openssl x509 -req -extfile ${clntCNF} -days 999 -passin "pass:${options.pass}" -in ${clntCSR} -CA ${options.servCRT} -CAkey ${options.servKEY} -CAcreateserial -out ${clntCRT}`);

          })
          .then(function() {

            console.log('Generate PFX for browser import.');
            return exec(`openssl pkcs12 -export -out ${clntPFX} -inkey ${clntKEY} -in ${clntCRT} -password "pass:${options.pass}" -passin "pass:${options.pass}"`);

          });
      });
    });
};

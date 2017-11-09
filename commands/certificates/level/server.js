const exec = require('promised-exec');
const fs = require('fs-extra');

module.exports = function(options) {

  if (fs.existsSync(options.servDir)) {
    return;
  }

  return Promise.resolve()
    .then(function() {

      console.log('Generate a private key for the server.');
      return exec(`openssl genrsa -out ${options.servKEY} 4096`);

    })
    .then(function() {

      console.log('Generate the certificate signing request for the server.');
      return exec(`openssl req -new -config ${options.servCNF} -key ${options.servKEY} -out ${options.servCSR}`);

    })
    .then(function() {

      console.log('Generate the certificate signing request for the server.');
      return exec(`openssl x509 -req -extfile ${options.servCNF} -days 999 -passin "pass:${options.pass}" -in ${options.servCSR} -CA ${options.authCRT} -CAkey ${options.authKEY} -CAcreateserial -out ${options.servCRT} -extensions x509_ext`);

    });

};

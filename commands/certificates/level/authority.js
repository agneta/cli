const exec = require('promised-exec');
const fs = require('fs');

module.exports = function(options) {

  if (fs.existsSync(options.authDir)) {
    return;
  }

  return Promise.resolve()
    .then(function() {

      console.log('Create a new certificate authority');
      return exec(`openssl req -new -x509 -days 9999 -config ${options.authCNF} -keyout ${options.authKEY} -out ${options.authCRT}`);

    });

};

const chalk = require('chalk');
const Promise = require('bluebird');
var rs = require('jsrsasign');
const _ = require('lodash');

module.exports = function() {

  Promise.resolve()
    .then(function() {
      return require('../secret/get').promise({
        prop: 'default.keys.server'
      });
    })
    .then(function(result) {
      return Promise.resolve()
        .then(function() {
          console.log(result.cert);
          return show(result.cert)
            .then(function(result){
              console.log(chalk.gray('Public Server Certificate:'));
              console.log(result);
              console.log();
            });
        })
        .then(function() {

          console.log(chalk.gray('Intermediate Certificates:'));

          return Promise.each(result.ca,function(cert,index,length){
            show(cert)
              .then(function(result){
                console.log('');
                console.log(chalk.gray(`[${index}/${length}]---------------------------`));
                console.log(result);
              });
          });
        });

    })
    .catch(function(err) {
      console.error(err);
    });

  function show(cert) {
    return Promise.resolve()
      .then(function() {
        var x = new rs.X509();
        x.readCertPEM(cert);
        return x.getInfo();
      })
      .catch(function(err) {
        if(_.isString(err)){
          return chalk.bold.red(`Invalid certificate: ${err}`);
        }
        return Promise.reject(err);
      });

  }


};

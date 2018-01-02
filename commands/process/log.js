const Promise = require('bluebird');
const {
  spawn
} = require('child_process');
const pm2 = require('pm2');


function tail(prop) {


  return Promise.resolve()
    .then(function() {
      return new Promise(function(resolve,reject) {

        pm2.describe('agneta',function(err,result){
          if(err){
            return reject(err);
          }
          resolve(result);
        });

      });

    })
    .then(function(result) {
      console.log(result);
      var process = result[0];
      spawn('tail', ['-n', '1000', '-f', process.pm2_env[prop]], {
        stdio: 'inherit'
      });

    })
    .catch(console.error);
    
}

module.exports = {
  output: function() {
    tail('pm_out_log_path');
  },
  errors: function() {
    tail('pm_err_log_path');
  }
};

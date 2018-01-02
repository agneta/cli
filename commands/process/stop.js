const pm2 = require('pm2');
const Promise = require('bluebird');

function promise() {

  return Promise.resolve()
    .then(function() {
      return new Promise(function(resolve,reject) {

        pm2.stop('agneta',function(err,list){

          if(err){
            reject(err);
          }

          resolve(list);
        });

      });
    });

}

module.exports = {
  promise: promise,
  command: function(){
    promise()
      .then(function(list) {
        console.log(list);
        process.exit();
      });
  }
};

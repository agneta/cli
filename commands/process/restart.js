const pm2 = require('pm2');

module.exports = function() {

  pm2.restart('agneta',function(err,list){

    if(err){
      console.error(err);
    }

    console.log(list);
    process.exit();

  });

};

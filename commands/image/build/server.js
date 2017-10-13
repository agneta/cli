const express = require('express');
const path = require('path');
const Promise = require('bluebird');
const config = require('./config');

module.exports = function() {

  var app = express();

  app.use('/keys', express.static(
    path.join(
      process.cwd(),
      '../keys'
    )
  ));

  app.use(function(req,res){
    res.send('Not found');
  });

  var port = config.server.port;

  app.listen(port,function(){
    console.log(`Listening to port ${port}`);
  });
  return Promise.resolve();

};

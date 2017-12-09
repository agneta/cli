const fs = require('fs-extra');
const path = require('path');

Promise.resolve()
  .then(function() {

    var secret = process.env.AGNETA_SECRET_KEY;

    return fs.outputJson(
      path.join(process.cwd(),
        '../secret.json'
      ), secret
    );
  })
  .then(function() {
    return require('./ssh')();
  })
  .then(function() {
    return require('./git')();
  })
  .catch(function(err){
    console.error(err);
    process.exit(2);
  });

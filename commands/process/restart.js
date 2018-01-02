
module.exports = function() {

  Promise.resolve()
    .then(function() {
      return require('./stop').promise();
    })
    .then(function() {
      return require('./start').promise();
    })
    .then(function() {
      console.log('Process restarted');
      process.exit();
    })
    .catch(console.error);

};

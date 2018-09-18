module.exports = function() {
  Promise.resolve()
    .then(function() {
      return require('../../secret/key/get').promise();
    })
    .then(function() {
      global.requireMain('setup')();
    });
};

module.exports = function() {
  return Promise.resolve()
    .then(function() {
      return require('./server')();
    })
    .then(function() {
      return require('./platform')();
    });

};

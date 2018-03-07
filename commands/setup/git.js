const Promise = require('bluebird');
const simplegit = require('simple-git/promise');

module.exports = function() {

  var git = simplegit(
    process.cwd()
  );

  return Promise.resolve()
    .then(function() {
      return git.init();
    });
};

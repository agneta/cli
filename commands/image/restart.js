module.exports = function(argv) {

  require('./stop').promise(argv)
    .then(function() {
      return require('./start')(argv);
    });

};


module.exports = function() {

  require('./stop').promise()
  .then(function(){
    return require('./start')();
  });

};

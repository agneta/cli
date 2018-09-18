const Usage = require('yargs/lib/usage');
const Y18n = require('y18n');
const path = require('path');
const _ = require('lodash');
module.exports = function(yargs) {

  const y18n = Y18n({
    directory: path.join(
      path.parse(require.resolve('yargs')).dir, 'locales'),
    updateFiles: false
  });
  var command = yargs.getCommandInstance();
  var handlers = command.getCommandHandlers();

  yargs.command('*','default',function() {

    yargs.recommendCommands();
    yargs.argv;

    var usage = Usage(
      _.extend(yargs),y18n);

    for(var key in handlers){

      switch(key){
        case '$0':
          continue;
      }

      var command = handlers[key];
      usage.command(command.original,command.description);
    }
    usage.showHelp();
  });

};

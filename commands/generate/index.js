const terminal = global.requireMain('server/terminal');

module.exports = function(yargs) {

  yargs.command('dependencies', 'Load from bower compomnents', init('dependencies'));
  yargs.command('services', 'Add services to the client applications', init('services'));

  function init(name) {
    return function() {
      terminal()
        .then(
          global.requireMain(`./${name}`)
        );
    };
  }

};

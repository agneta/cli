var shown = false;
module.exports = function(yargs) {
  if(shown){
    return;
  }
  shown =  true;
  yargs
    .strict()
    .version(false)
    .help(false)
    .argv;

  yargs.showHelp();
};

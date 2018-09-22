module.exports = function(yargs) {
  yargs.command('kube', 'Kubernetes', function() {
    yargs.command('deploy', 'Deploy on kubernetes', require('./deploy'));
  });
};

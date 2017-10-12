const fs = require('fs-extra');
const path = require('path');
const S = require('string');
const Promise = require('bluebird');
const config = require('./config');

module.exports = function() {

  var pkg = require(
    path.join(process.cwd(), 'package.json')
  );

  var keyName = pkg.name || path.parse(process.cwd()).name;
  keyName = S(keyName).slugify().replaceAll('-', '_').s;
  keyName += '_rsa';

  var pathSSH = path.join(process.env.HOME, '.ssh');
  var pathKeys = path.join(process.cwd(), '../keys');

  var pathKeySource = path.join(pathKeys, 'git_rsa');
  var pathPubSource = pathKeySource + '.pub';

  var pathKeyTarget = path.join(pathSSH, keyName);
  var pathPubTarget = pathKeyTarget + '.pub';

  var pathSSHConfig = path.join(pathSSH, 'config');

  return Promise.resolve()
    .then(function() {

      if (fs.existsSync(pathKeyTarget) &&
        fs.existsSync(pathPubTarget)
      ) {
        console.log('Keys already exist');
        return;
      }

      console.log(`${pathKeyTarget} does not exist`);

      if (!fs.existsSync(pathKeySource) ||
        !fs.existsSync(pathPubSource)
      ) {
        throw new Error('Must have git rsa keys available to proceed');
      }

      return fs.copy(pathKeySource, pathKeyTarget)
        .then(function() {
          fs.copy(pathPubSource, pathPubTarget);
        });

    })
    .then(function() {
      return fs.ensureFile(pathSSHConfig);
    })
    .then(function() {
      return fs.readFile(pathSSHConfig);
    })
    .then(function(content) {

      if(content.indexOf(keyName)>=0){
        console.log('SSH config entry already exists');
        return;
      }
      var host = config.remote.url.split(':')[0];
      host = host.split('@')[1];

      var entry = [
        '',
        '',
        `Host ${host} ${config.host}`,
        `Hostname ${config.host}`,
        `IdentityFile ~/.ssh/${keyName}`,
        `User ${config.username}`
      ].join('\n');

      content += entry;

      console.log('Add SSH config entry', entry);

      return fs.writeFile(pathSSHConfig,content);
    });

};

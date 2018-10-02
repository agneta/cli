const path = require('path');
const md5 = require('md5');

const dirRelative = '.agneta';
const dirAbsolute = path.join(process.env.HOME, dirRelative);
process.env.XDG_CONFIG_HOME = dirAbsolute;

const configstore = require('configstore');
const fs = require('fs');
const _ = require('lodash');

var configOptions = {
  globalConfigPath: true
};

var pathPkg = path.join(process.cwd(), 'package.json');
var pathAppConfig = path.join(process.cwd(), 'config.json');

var pkg = {};
var app = {};
var confName = 'global';
var prjBase = 'project';

if (fs.existsSync(pathPkg)) {
  pkg = require(pathPkg);
}

if (fs.existsSync(pathAppConfig)) {
  app = require(pathAppConfig);
}

var name = pkg.name;
if (!name) {
  name = _.kebabCase(path.parse(process.cwd()).name);
  name = _.replace(name, new RegExp('-', 'g'), '_');
}
var confPath = path.join(prjBase, name);

var conf = {
  app: app,
  agneta: new configstore(confName, {}, configOptions),
  project: new configstore(confPath, {}, configOptions)
};

conf.name = name;
conf.processName = name;

conf.dir = {
  absolute: dirAbsolute,
  relative: path.join(dirRelative, prjBase)
};

module.exports = conf;

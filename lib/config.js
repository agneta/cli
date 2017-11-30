const configstore = require('configstore');
const path = require('path');
const S = require('string');
const fs = require('fs');

var pathPkg = path.join(process.cwd(), 'package.json');
var pkg = {};
var confName = 'agneta';

if (fs.existsSync(pathPkg)) {
  pkg = require(
    pathPkg
  );
}

var name = pkg.name || S(path.parse(process.cwd()).name).slugify().replaceAll('-', '_').s;
var confPath = path.join(confName, name);

var  conf = {
  agneta: new configstore(
    confName, {}
  ),
  project: new configstore(
    confPath, {}
  )
};


conf.name = name;

var confPathRelative = path.join(`.config/configstore/${confName}`);

conf.dir = {
  absolute: path.join(process.env.HOME, confPathRelative),
  relative: confPathRelative
};

module.exports = conf;

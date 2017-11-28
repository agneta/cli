const configstore = require('configstore');
const path = require('path');
const S = require('string');
const fs = require('fs');

var pathPkg = path.join(process.cwd(), 'package.json');
var pkg = {};

if (fs.existsSync(pathPkg)) {
  pkg = require(
    pathPkg
  );
}

var name = pkg.name || S(path.parse(process.cwd()).name).slugify().replaceAll('-', '_').s;
var confPath = path.join('agneta', name);

const conf = new configstore(
  confPath, {}
);
conf.name = name;

var confPathRelative = path.join('.config/configstore/agneta');

conf.dir = {
  absolute: path.join(process.env.HOME, confPathRelative),
  relative: confPathRelative
};

module.exports = conf;

const configstore = require('configstore');
const path = require('path');
const S = require('string');

var pkg = require(
  path.join(process.cwd(), 'package.json')
);

var name = pkg.name || path.parse(process.cwd()).name;
name = S(name).slugify().replaceAll('-', '_').s;

const conf = new configstore(
  path.join('agneta', name), {});


conf.name = name;

module.exports = conf;

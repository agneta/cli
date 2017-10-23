const configstore = require('configstore');
const path = require('path');

var pkg = require(
  path.join(process.cwd(), 'package.json')
);
var name = pkg.name || path.parse(process.cwd()).name;

const conf = new configstore(
  path.join('agneta', name), {});

module.exports = conf;

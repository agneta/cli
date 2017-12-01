const fs = require('fs-extra');
const Promise = require('bluebird');

module.exports = function(options) {

  var keys = ['servCRT',
    'servKEY',
    'authCRT'
  ];

  return Promise.resolve()
    .then(function() {
      return Promise.map(keys,function(key){
        return fs.readFile(options[key])
          .then(function(content) {
            console.log(content);
          });
      });
    });
};

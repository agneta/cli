const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function(options) {

  var pathProxy = path.join(process.cwd(), '.proxy');

  var data = {
    use_backend: [],
    backend: []
  };

  return Promise.resolve()
    .then(function() {
      return fs.readFile(path.join(__dirname, 'backend.cfg'));
    })
    .then(function(backendTemplate) {

      backendTemplate = _.template(backendTemplate);
      return Promise.map(_.keys(options.images),function(name){

        var containers = options.images[name];
        if(!containers.length){
          return;
        }


        containers = containers.map(function(container,index){
          return `server ${container.name}_${index} ${container.name}:${container.port} check`;
        }).join('\n    ');

        data.use_backend.push([`acl is_${name} req_ssl_sni -i ${name}.localhost`,
          `use_backend nodes_${name} if is_${name}`
        ].join('\n    '));

        data.backend.push(backendTemplate({
          data:{
            name: name,
            containers: containers
          }
        }));

      });

    })
    .then(function() {
      return fs.readFile(path.join(__dirname, 'config.cfg'));
    })
    .then(function(content) {

      data.use_backend.join('\n');
      data.backend.join('\n');

      content = _.template(content)({
        data: data
      });

      return fs.outputFile(path.join(pathProxy, 'config.cfg'), content);
    })
    .then(function() {
      console.log('Generated proxy configuration');
    });
};
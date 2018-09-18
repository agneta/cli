import Docker = require('dockerode');
const ContainerSelect = require('../container-select');
module.exports = function() {
  var docker = new Docker();
  let containerSelect = ContainerSelect(docker);
  containerSelect()
    .then(function(container: Docker.Container) {
      return container.stop();
    })
    .then(function(container) {
      return container.remove();
    })
    .then(function(data) {
      console.log('container removed');
    })
    .catch(function(err) {
      console.log(err);
    });
};

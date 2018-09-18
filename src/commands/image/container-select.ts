import Docker = require('dockerode');
import inquirer = require('inquirer');
const config = require('./config');
const chalk = require('chalk');

module.exports = function(docker: Docker) {
  return function() {
    return docker
      .listContainers({
        filters: {
          ancestor: [config.image.app]
        }
      })
      .then(function(containers: [Docker.ContainerInfo]) {
        if (!containers.length) {
          console.log(
            chalk.red(
              chalk.bold(
                `There are no containers running with image: ${
                  config.image.app
                }`
              )
            )
          );
          return;
        }

        let choices = containers.map(function(container: Docker.ContainerInfo) {
          return {
            name: `${container.Image} - ${container.Status}`,
            value: container.Id
          };
        });

        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'container',
              choices: choices,
              message: 'Select a container:'
            }
          ])
          .then(function(answers) {
            return docker.getContainer(answers.container);
          });
      });
  };
};

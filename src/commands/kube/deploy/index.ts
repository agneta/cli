import k8s = require('@kubernetes/client-node');
import { V1beta2StatefulSet } from '@kubernetes/client-node';
import fs = require('fs-extra');
import { ClientResponse } from 'http';
import yaml = require('js-yaml');
import _ = require('lodash');
import path = require('path');

module.exports = function() {
  const configFile = process.env.HOME + '/.kube/config';

  if (!fs.existsSync(configFile)) {
    return;
  }

  const kc = new k8s.KubeConfig();
  kc.loadFromFile(configFile);

  const k8sApiCore = new k8s.Core_v1Api(kc.getCurrentCluster().server);
  const k8sApiApps = new k8s.Apps_v1Api(kc.getCurrentCluster().server);
  k8sApiCore.setDefaultAuthentication(kc);
  k8sApiApps.setDefaultAuthentication(kc);

  var deployment = fs.readFileSync(
    global.srcPath('commands/kube/deploy/deployment.yaml'),
    'utf8'
  );
  deployment = yaml.safeLoad(deployment);
  var body = new k8s.V1Deployment();
  _.extend(body, deployment);

  Promise.resolve()
    .then(function() {
      return k8sApiApps.patchNamespacedDeployment('agneta', 'agneta', body);
    })
    .catch(function(err) {
      if (err.body) {
        console.error(err.body.status);
        console.error(err.body.message);
        return;
      }
      console.error(err);
    });
};

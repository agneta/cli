import k8s = require('@kubernetes/client-node');
import { V1beta2StatefulSet } from '@kubernetes/client-node';
import fs = require('fs-extra');
import { ClientResponse } from 'http';
import yaml = require('js-yaml');
import _ = require('lodash');
import path = require('path');
import { Argv } from 'yargs';

module.exports = function(yargs: Argv) {
  yargs.command('cluster', 'Check your clusters', function(
    yargsCluster: Argv
  ): Argv {
    const configFile = process.env.HOME + '/.kube/config';

    if (!fs.existsSync(configFile)) {
      return;
    }

    const kc = new k8s.KubeConfig();
    kc.loadFromFile(configFile);

    const k8sApiCore = new k8s.Core_v1Api(kc.getCurrentCluster().server);
    const k8sApiApps = new k8s.Apps_v1beta1Api(kc.getCurrentCluster().server);
    k8sApiCore.setDefaultAuthentication(kc);
    k8sApiApps.setDefaultAuthentication(kc);
  });
};

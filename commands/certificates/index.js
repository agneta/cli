const path = require('path');
const config = require('./config');

const client = require('./src/client');
const server = require('./src/server');
const authority = require('./src/authority');

//-----------------------------------

const pass = config.password;

const outDir = path.join(__dirname, 'output');
const tmpDir = path.join(__dirname, 'tmp');
const cnfDir = path.join(__dirname, 'config');

const servDir = path.join(outDir, 'server');
const clntRoot = path.join(outDir, 'client');

const servCSR = path.join(servDir, 'server-csr.pem');
const servCRT = path.join(servDir, 'server-crt.pem');
const servKEY = path.join(servDir, 'server-key.pem');
const servCNF = path.join(tmpDir, 'server.cnf');

const authDir = path.join(outDir, 'authority');
const authCRT = path.join(authDir, 'ca-crt.pem');
const authKEY = path.join(authDir, 'ca-key.pem');
const authCNF = path.join(tmpDir, 'authority.cnf');

const clntCNF = path.join(cnfDir, 'client.cnf');


var options = {
  config: config,
  pass: pass,
  outDir: outDir,
  tmpDir: tmpDir,
  cnfDir: cnfDir,
  servCSR: servCSR,
  servCRT: servCRT,
  servKEY: servKEY,
  servCNF: servCNF,
  authDir: authDir,
  authCRT: authCRT,
  authKEY: authKEY,
  authCNF: authCNF,
  servDir: servDir,
  clntRoot: clntRoot,
  clntCNF: clntCNF,
};


Promise.resolve()

  //----------------------------------------------
  // AUTHORITY

  .then(function() {

    return authority(options);

  })

  //----------------------------------------------
  // SERVER

  .then(function() {

    return server(options);

  })

  //--------------------------------------------------
  // CLIENT

  .then(function() {

    return client(options);

  })
  .then(function() {
    console.log('complete');
  })
  .catch(function(err) {
    console.log('Error');
    console.log(err);
  });

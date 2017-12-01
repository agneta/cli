const path = require('path');
const config = require('./config');
const pass = config.password;

module.exports = function(options) {

  const outDir = path.join(process.cwd(), 'tmp', 'certificates');
  const cnfDir = path.join(__dirname, 'config');

  const servDir = path.join(outDir, 'server');
  const clientDir = path.join(outDir, 'client');
  const authDir = path.join(outDir, 'authority');

  return {
    config: config,
    pass: pass,
    main: options,
    //
    outDir: outDir,
    cnfDir: cnfDir,
    //
    authDir: authDir,
    servDir: servDir,
    clientDir: clientDir,
    //
    servCSR: path.join(servDir, 'server-csr.pem'),
    servCRT: path.join(servDir, 'server-crt.pem'),
    servKEY: path.join(servDir, 'server-key.pem'),
    servCNF: path.join(servDir, 'server.cnf'),
    //
    authCRT: path.join(authDir, 'ca-crt.pem'),
    authKEY: path.join(authDir, 'ca-key.pem'),
    authCNF: path.join(authDir, 'authority.cnf'),
    //
    cnfServer: path.join(cnfDir, 'server.cnf'),
    cnfAuth: path.join(cnfDir, 'authority.cnf'),
    cnfClient: path.join(cnfDir, 'client.cnf')
  };
};

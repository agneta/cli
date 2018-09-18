const fs = require('fs');
const path = require('path');
module.exports = function(){
  if(!fs.existsSync(path.join(
    process.cwd(),'package.json'
  ))){
    throw new Error('The current directory does not seem to be an agneta project');
  }
};

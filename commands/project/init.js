const klaw = require('klaw');
const path = require('path');

module.exports = function() {

  var sourceDir = path.join(__dirname,'template');
  var walker = klaw(sourceDir);

  walker.on('data', function(item) {

    if(!item.stats.isFile()){
      return;
    }

    var location = path.relative(sourceDir, item.path);
    console.log(location);
  });


};

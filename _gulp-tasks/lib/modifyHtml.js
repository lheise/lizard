/**
* This is a helper function to modify HTML before it's final output. 
* An example would be if you wanted to replace a comment block with code
* 
* @author jeremypeter
*/

var es = require('event-stream');
var config = require('../configs/main');

function modifyHtml(){
  return es.map(function(file, cb){

    var html = file.contents.toString();
    
    html = config.modifyHtml(html);

    file.contents = new Buffer(html);
    
    cb(null, file);

  });
};

module.exports = modifyHtml;

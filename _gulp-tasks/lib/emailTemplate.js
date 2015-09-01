var path = require('path');
var fs   = require('fs');


/**
* Takes a file path and creates the src to be passed to gulp.src depending
* on whether it's a partials file or a template.html file
*
* @returns {Object} an object literal with filepath and object containing 
* the partial names to be passed into gulp-template
*/

function emailTemplate(file){

    var join             = path.join;
    var basename         = path.basename;
    var obj              = {};
    var pathBuild        = '';
    var finalPartialPath = '';
    var dirs             = file.split(path.sep);
    var newArr, partialPath, partialFiles;

    // Loop through each directory and build up a new partials path 
    dirs.forEach(function(dir, index){
      pathBuild += dir + path.sep;
      newArr = pathBuild.split(path.sep);
      newArr.push('partials');
      partialPath = path.normalize(newArr.join(path.sep));

      // if partials directory exists while building the path,
      // create an object to be passed to gulp-template
      if(fs.existsSync(partialPath)){
        finalPartialPath = pathBuild;
        partialFiles = fs.readdirSync(partialPath);
        partialFiles.forEach(function(file){
          obj[basename(file, '.html')] = fs.readFileSync(join(partialPath,file), 'utf8');
        });
      }
    });

    file = (basename(file) === 'template.html') ? file : join(finalPartialPath, '**/template.html');
    
    return {
      file: file,
      obj: obj
    };
}

module.exports = emailTemplate;
var htmlMin = require('html-minifier').minify;
var es      = require('event-stream');
var config = require('../configs/main');
var gutil = require('gulp-util');

/*
* Minify html depending on whether regex test is true
*
* @param {Regex} config.regex - regex to test
* @param {Object} config.options - minify options 
*
* @returns {Object} a stream with html minified or unminified
*/

function minify(config){

  return es.map(function(file, cb){

    var html = file.contents.toString();

    try {

      if( html.search(config.regex) !== -1 ) {
        
        // Remove new lines before minifying 
        html = html.replace(/\n/g, '');
        file.contents = new Buffer(htmlMin(html, config.options));

      } else {
        
        // remove two or more new lines
        html = html.replace(/^\s*\n{2,}/gm, '');
        file.contents = new Buffer(html);
      }

    } catch (err) {
      return cb(new gutil.PluginError('gulp-htmlmin', err, config.options));
    }

    cb(null, file);

  });
}

module.exports = minify;
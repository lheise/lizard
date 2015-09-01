var _         = require('lodash');
var marked    = require('meta-marked');
var es        = require('event-stream');
var gutil     = require('gulp-util');
var template  = _.template;


/*
* Compiles Lodash templates. If there is markdown style metadata found in the
* document, it will add the metadata to the data object to be passed
* to Lodash template method
* 
* 
* @param {Object} literal to be passed to lodash template
* @param {Object} Lodash template options object
* 
* @returns {Object} stream with compiled lodash template
*/

function loTemplate(obj, options){

  var reYAML = /(---[\s\S]+---)/g;
  var html, yaml, yamlObj, newHtml, newObj;

  return es.map(function(file, cb){

    html = file.contents.toString();
    yaml = html.match(reYAML);

    // Create object from YAML metadata and remove it from html
    if(yaml){
      yamlObj = marked(yaml[0]).meta;

      // Add quert property to file obj
      file.query = yamlObj.query
      html = html.replace(reYAML, '');
    }

    // Let's add option to use a template layout 
    if(obj.layout){
      obj.content = html;
      html = obj.layout;
    }

    newObj = _.assign(obj, yamlObj); 

    // compile any partials or metadata
    newHtml = template(html, newObj, options);

    // Needed for htmlMinify plugin
    file.isLodashTemplate = Object.keys(newObj).length > 0;

    try {
      // compile any variables left over from metadata
      file.contents = new Buffer(template(newHtml, yamlObj || {}, options));
      cb(null, file);
    } catch (err) {
      cb(new gutil.PluginError('gulp-template', err, {fileName: file.path}));
    }

  });
}

module.exports = loTemplate;

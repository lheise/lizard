var es      = require('event-stream');
var gutil = require('gulp-util');
var appendQuery = require('append-query');
var cheerio = require('cheerio');

/*
* Appends query parameters to urls if found in YAML metadata 
* located in the template.html file
*
* @returns {Object} a stream with query parameters appended to urls
*/

function append(config){

  return es.map(function(file, cb){

    
    if(file.query){
      var $ = cheerio.load(file.contents);
      var links = $('a');
      var $this, href;
      
      try {

       links.each(function(){
        $this = $(this);
        href = $this.attr('href');
        if(href.match(/^http/g)){
          $this.attr('href', decodeURIComponent(appendQuery(href, file.query)));
        }
       });

       file.contents = new Buffer($.html());

      } catch (err) {
        return cb(new gutil.PluginError('gulp-append-query', err));
      }
    }

    cb(null, file);

  });
}

module.exports = append;
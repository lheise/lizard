var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var gulpFilter = require('gulp-filter');
var config = require('./configs/main');

/*
* Prevents gulp-mocha from exiting watch
* ref: http://stackoverflow.com/questions/21602332/catching-gulp-mocha-errors
*
*/
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


/*
* Filter files with a .js extenstion to use with gulp-filter
*
* @returns {Boolean} true
*/
function jsFilter(file){
  var reExt = /\.js/;
  return reExt.test(file.path);
}

// Internal Tests
gulp.task('test-email', function() {
    
    gulp.src(config.testFiles)
      .pipe(watch({emit: 'all'}, function(files){

        files
          .pipe(gulpFilter(jsFilter))
          .pipe(mocha({ reporter: 'spec' }))
          .on('error', handleError)

      }));
});

gulp.task('test', ['test-email']);

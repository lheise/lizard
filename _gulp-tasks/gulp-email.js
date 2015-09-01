// gulp plugins 
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var rename       = require('gulp-rename');
var htmlhint     = require('gulp-htmlhint');
var htmlmin      = require('gulp-htmlmin');
var emailBuilder = require('gulp-email-builder');
var gulpif       = require('gulp-if');
var litmus       = require('gulp-litmus');
 
// native/npm modules 
var fs          = require('fs');
var path        = require('path');
var browserSync = require('browser-sync').create();
var es          = require('event-stream');

// local modules
var args          = require('./lib/args');
var config        = require('./configs/main');
var sendMail      = require('./lib/sendMail');
var minify        = require('./lib/htmlMinify'); 
var template      = require('./lib/lodashTemplate');
var appendQuery   = require('./lib/appendQuery');
var modifyHtml    = require('./lib/modifyHtml');
var emailTemplate = require('./lib/emailTemplate');

// command line arguments
var argLitmus   = args.litmus; 
var argSendmail = args.mail;
var notInternal = argLitmus || argSendmail;


/**
* Pass through stream to go to next pipe
* 
* @returns {Object} a stream
*/

function passThrough(){
  return es.map(function(file, cb){
    cb(null, file);
  });
}

/**
* Get the base directory
*
* @param {Object} file - vinyl file object
*
* @returns {String} the base path 
*/

function getBase(file){
  return file.base;
}


/**
* Updates the base to the parent directory of file.path
*
* @returns {Object} a stream that updates the base to the parent directory
*/

function updateBase(){
  return es.map(function(file, cb){
    file.base = path.dirname(file.path);
    cb(null, file);
  });
}

// Build production email
gulp.task('buildEmail', function(){
  gulp.watch(config.fileGlob).on('change', function(evt){

    var email = emailTemplate(evt.path);

    return gulp.src(email.file)
      .pipe(template(email.obj))
      .on('error', gutil.log)
      .pipe(htmlhint(config.hint))
      .pipe(htmlhint.reporter())
      .pipe(emailBuilder({encodeSpecialChars: true}))
      .pipe(appendQuery())
      .pipe(gulpif(notInternal, passThrough(), modifyHtml()))
      .pipe(gulpif(notInternal, passThrough(), minify(config.minify)))
      .pipe(updateBase())
      .pipe(gulpif(notInternal, passThrough(), rename(config.dest)))
      .pipe(gulpif(notInternal, passThrough(), gulp.dest(getBase)))
      .pipe(browserSync.stream())
      .pipe(gulpif(notInternal, passThrough(), gulp.dest(config.testPath)))
      .pipe(gulpif(argLitmus, litmus(config.litmus)))
      .pipe(gulpif(argSendmail, sendMail()))
      .on('error', gutil.log);

  });
});

// Sync devices and browsers
gulp.task('browserSync', ['buildEmail'], function(){

  //the directory to our working environment
  var base = path.resolve(config.base);

  // init browser-sync
  browserSync.init({
    open: !notInternal,
    rewriteRules: config.rewriteRules,
    server: {
      baseDir: base,
      index: config.dest,
      directory: true
    }
  });

});

gulp.task('default', ['buildEmail', 'browserSync']);


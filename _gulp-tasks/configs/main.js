var path = require('path');
var litmusConf = require('./litmus');
var mailPromptConf = require('./mailPrompts');
var rewriteRulesConf = require('./rewriteRules');

var minifyRegex = /<\/body>/g;

module.exports = {

  // Files to watch
  fileGlob: ['**/template.html'],
  
  // Destination folder to send test fixture for our tests
  testPath: './_gulp-tasks/tests/fixtures',

  // Test files to watch 
  testFiles: ['./_gulp-tasks/tests/**/email.html', './_gulp-tasks/tests/**/*.js'],
  
  // Destination file to write production code to
  dest: 'email.html',

  // Base directory for browser sync
  base: './',

  // minify based on regex and use options from https://www.npmjs.org/package/html-minifier
  minify: {
    regex: minifyRegex,
    options: { removeComments: true, removeAttributeQuotes: true, collapseWhitespace: true, minifyCSS: true, conservativeCollapse: true }
  },

  // HTML hint rules based on https://github.com/yaniswang/HTMLHint/wiki/Rules
  hint: {
    'tag-pair': true, 
    'spec-char-escape': true, 
    'doctype-first': false 
  },

  // Modify HTML in template.html before email.html gets created
  modifyHtml: function(html){
    return html;
  }, 

  // Litmus configuration to pass to `gulp-litmus` plugin 
  litmus: litmusConf,

  // Array of questions to pass to `inquirer.prompt`. Execute when using `sendMail` lib
  mailPrompts: mailPromptConf,

  // Array of object rules to be passed to BrowserSync's v2.x.x `options.rewriteRules`
  rewriteRules: rewriteRulesConf
};
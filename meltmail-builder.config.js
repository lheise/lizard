var communicationMessage = /<!--(?=((?:\s+)?\bcommunication\b-\bmessage\b(?:\s+)?-->))\1([\s\S]+)<!--(?:[\s]+)?\bend\b\s+\bcommunication\b-\bmessage\b(?:[\s]+)?-->/gi;
var cmHacks = /<\/unsubscribe>|<\/singleline>/g;

module.exports = {

  // Files to watch
  fileGlob: ['**/template.html','!node_modules/'],

  // Destination folder to send test fixture for our tests
  testPath: './_tests/fixtures',

  // Test files to watch
  testFiles: ['./_tests/**/email.html', './_tests/**/*.js'],

  // Destination file to write production code to
  dest: 'email.html',

  // Base directory for browser sync
  base: './',

  // minify based on regex and use options from https://www.npmjs.org/package/html-minifier
  minify: {
    regex: 'donotminify',
    options: { removeComments: true, removeAttributeQuotes: true,  minifyCSS: true, conservativeCollapse: true }
  },
  // used for identifying if the email is a CM build or an external build
  cmDontConvert: {
    regex: cmHacks
  },
  // HTML hint rules based on https://github.com/yaniswang/HTMLHint/wiki/Rules
  hint: {
    'tag-pair': true,
    'spec-char-escape': true,
    'doctype-first': false
  },

  // Modify HTML in template.html
  modifyHtml: function(html){
    html = html.replace(/href=".*?"/gi, match => match.replace(/&amp;/g, '&'));
    return html;
  }
};

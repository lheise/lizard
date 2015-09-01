/**
 * Array of object rules to be passed to BrowserSync's v2.x.x `options.rewriteRules`
 * Use this to modify the html before it's sent to the browser
 * 
 * @example
 * {
 *   match: /</body>/,
 *   fn: function(match){
 *     return 'Hello there' + match;
 *   }
 * }
 * 
 */

var rules = [];

module.exports = rules;
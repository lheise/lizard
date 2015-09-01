var yargs = require('yargs');

var helpMessage = ' \nOptions\n\
---------\n\
 -l, --litmus Send tests to Litmus\n\
 -m, --mail   Send test to your email\n\
 -h, --help   Output options\n'

var args = yargs.boolean(['litmus', 'mail', 'help'])
              .alias('l', 'litmus')
              .alias('m', 'mail')
              .alias('h', 'help')
              .usage(helpMessage)
              .argv
  
if(args.help){
  yargs.showHelp();
  process.exit();
}

module.exports = {
  litmus: args.litmus, 
  mail: args.mail
};
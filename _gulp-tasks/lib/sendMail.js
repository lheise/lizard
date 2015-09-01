/**
* Send email tests using nodemailer and inquirer modules
* @author jeremypeter
*/


var gutil       = require('gulp-util'),
    es          = require('event-stream'),
    fs          = require('fs'),
    inquirer    = require('inquirer'),  
    nodemailer  = require('nodemailer'),
    args        = require('yargs').boolean(['log']).argv,
    mailPrompts  = require('../configs/main').mailPrompts;


/**
* Send yourself email tests and creates a log file if --log is passed
*
* @returns {Object} a stream 
*/

function sendMail(){

  return es.map(function(file, cb){

    // Create a log file if --log is passed as cli argument
    if(args.log){
      file.pipe(fs.createWriteStream('MAIL-LOG.html'))
      gutil.log(gutil.colors.cyan('MAIL-LOG.html created'))
    }

    inquirer.prompt(mailPrompts, function(res){         
      
      // Mail options
      var mailOpts = {
        from: res.from,
        to: res.to,
        subject: res.subject,
        text: '',
        html: file.contents
      }
      
      // Set up transport method
      smtpTransport = nodemailer.createTransport("SMTP",{
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
      });

      gutil.log(gutil.colors.green('Preparing to mail...'));

      // Send email
      smtpTransport.sendMail(mailOpts, function(err, res){
        
        if(err){
          gutil.log(err);
        }else{
          gutil.log(gutil.colors.green('Sent!'));
          gutil.log(gutil.colors.green(res.message));
        }
      })

      cb(null, file);
    });

  });
}

module.exports = sendMail;
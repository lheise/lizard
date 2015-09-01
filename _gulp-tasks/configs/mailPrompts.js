/**
 * Config for `lib/sendMail.js` to send email tests
 *
 * Is an array of questions to pass to `inquirer` module: 
 * https://www.npmjs.com/package/inquirer#question
 */

var yoConfig = require('../../.yo-rc.json')['generator-meltmail'];

module.exports = [
  {
    type: 'list',
    name: 'from',
    message: 'From: ',
    choices: yoConfig.emails.sort()
  },
  {
    type: 'checkbox',
    name: 'to',
    message: 'To: ',  
    choices: yoConfig.emails.sort()
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Subject: ',
    default: process.env.USER + ': TEST FROM LOCAL'
  }

];
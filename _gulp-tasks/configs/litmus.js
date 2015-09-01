/**
 * Config for gulp-litmus for sending tests to Litmus.
 * 
 * If you would like to add any more `applications`, they can be
 * found at: https://meltmedia.litmus.com/emails/clients.xml
 * under the `<application_code>` xml tag
 */

var yoConfig = require('../../.yo-rc.json')['generator-meltmail'];

module.exports = {
  username: process.env.LIT_USER,
  password: process.env.LIT_PASS,
  url: 'https://meltmedia.litmus.com',
  applications: yoConfig.litmus.litmus_clients
};
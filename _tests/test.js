var http = require('http');
var fs = require('fs');
var URL = require('url');
var querystring = require('querystring');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = require('superagent');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('Email template', function(){

  var html = fs.readFileSync(__dirname + '/fixtures/email.html');
  var $ = cheerio.load(html);

 
  it('should be minified', function(){
    var html = $.html();
    var reNewLine = /\n/g;

    expect(reNewLine.test(html)).to.be.false;

  });

  describe('links', function() {
    
    var re_c = /\bc\b/;
    var re_moc = /\bmoc\b/;
    // var re_cid = /\bcid\b/;
    var re_url = /https?/;
    var urls = $('a');
    var url, query, queryObj;

    var mocValues = [];
    // var cidValues = [];
    var validUrls = [];
    var optOutLink = [];
    var trackingCode = [];
      
    it('should return a status of 200', function(){

      this.timeout(20000);   

      urls.each(function(){
        var url = $(this).attr('href');
        if(re_url.test(url)){
          validUrls.push(url);
        }
      });

      return Promise.map(validUrls, function(url){
        return expect(getStatusCode(url)).to.eventually.equal('200 OK');
      });

    });

    describe('query string', function(){

      it('should only have one ? to start query string', function(){
        validUrls.forEach(function(url){
          expect(url.match(/\?/g).length).to.be.equal(1);
        });
      });

    });
    
  });

});


/**
* Function passed into Array.prototype.every method to compare the values 
* in an array and return true if all values are the same or false if they're not
*
* @returns {Boolean} true or false 
*/

function same(el, i, arr){
  return el === arr[0];
}


/**
* Get the status code of a url and log urls that do not give a status of 200 OK
*
* @returns {Object} a promise that resolves with the status code 
*/

function getStatusCode(url){

  return new Promise(function(resolve, reject){

    // Ignore SSL checking
    // This prevents the error: [UNABLE_TO_VERIFY_LEAF_SIGNATURE]
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    request.get(url)
      .redirects(0)
      .end(function(err, res){
        if(err) reject(err);

        if(res && res.status){
          var code = res.status;
          var status = code + ' ' + http.STATUS_CODES[code];

          if(code !== 200){
            console.log('    ' + url);
          }
          
          resolve(status);
        } else {
          resolve();
        }
      })
  });

}

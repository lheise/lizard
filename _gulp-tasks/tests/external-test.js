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


var html = fs.readFileSync(__dirname + '/fixtures/email.html');
var $ = cheerio.load(html);
var isInternal = $('singleline').siblings().is('unsubscribe');

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
        } else{
          resolve();
        }
        
      })
  });

}

/////////////////////////////////////////////////////////////////
// BEING TESTS
/////////////////////////////////////////////////////////////////

if(!isInternal){

  describe('External Email', function(){
   
    it('should NOT be minified', function(){
      var html = $.html();
      var reNewLine = /\n/g;

      expect(reNewLine.test(html)).to.be.true;

    });


    describe('<webversion> tag', function() {
      
      var webversion = $('webversion');
      
      it('should NOT exist', function() {
        expect(webversion.is('webversion')).to.be.false;
      });

    });


    describe('<unsubscribe> tag', function() {
      
      var unsubscribe = $('unsubscribe');

      it('should NOT exist', function(){
        expect(unsubscribe.is('unsubscribe')).to.be.false;
      });

    });


    describe('<singleline> tag', function() {
      
      var singleline = $('singleline');

      it('should NOT exist', function(){
        expect(singleline.is('singleline')).to.be.false;
      });

    });


    describe('links', function() {
      
      var re_c = /\bc\b/;
      var re_moc = /\bmoc\b/;
      var re_cid = /\bcid\b/;
      var re_url = /https?/;
      var re_unsub = /https:\/\/interactive\.genentech\.com/;
      var urls = $('a');
      var url, query, queryObj;

      var mocValues = [];
      var cidValues = [];
      var validUrls = [];
        
      it('should return a status of 200 OK', function(){

        this.timeout(20000);   

        urls.each(function(){
          var url = $(this).attr('href');
          if(re_url.test(url) && !re_unsub.test(url)){
            validUrls.push(url);
          }
        });
        
        return Promise.map(validUrls, function(url){
          return expect(getStatusCode(url)).to.eventually.equal('200 OK');
        });

      });


      it('should contain moc and cid parameters', function(){

        urls.each(function(){
          url = $(this).attr('href');

          if(re_url.test(url)){
            query = URL.parse(url).query;
            queryObj = querystring.parse(query);
      
            expect(queryObj).to.have.property('c');
            expect(queryObj).to.have.property('cid');
            expect(queryObj).to.have.property('moc');

            mocValues.push(queryObj['c']);       
            mocValues.push(queryObj['moc']);
            cidValues.push(queryObj['cid'])
          }
        });
      });

      it('should contain a value for moc and cid parameters', function(){
        
        urls.each(function(){
          var url = $(this).attr('href');
          
          if(re_url.test(url)){ 
            query = URL.parse(url).query;
            queryObj = querystring.parse(query);

            if(queryObj.hasOwnProperty('c')){ expect(queryObj['c'].trim()).to.not.be.empty; }
            if(queryObj.hasOwnProperty('moc')){ expect(queryObj['moc'].trim()).to.not.be.empty; }
            if(queryObj.hasOwnProperty('cid')){ expect(queryObj['cid'].trim()).to.not.be.empty; }

          }
        });
      });


      it('should contain only one moc and cid parameter', function(){
        
        urls.each(function(){
          var url = $(this).attr('href');

          if(re_url.test(url)){ 
            if(url.match(re_c) !== null){ expect(url.match(re_c).length).to.be.equal(1); }
            if(url.match(re_moc) !== null){ expect(url.match(re_moc).length).to.be.equal(1); }
            if(url.match(re_cid) !== null){ expect(url.match(re_cid).length).to.be.equal(1); }
          }
        });
      });

      it('should contain the same value for moc parameters', function(){
        expect(mocValues.every(same)).to.be.true;
      });

      it('should contain the same value for cid parameters', function(){
        expect(cidValues.every(same)).to.be.true;
      });

      describe('query string', function(){

        it('should only have one ? to start query string', function(){
          validUrls.forEach(function(url){
            expect(url.match(/\?/g).length).to.be.equal(1);
          });
        });

      });
      
    });


    describe('prc code', function() {

      var rePrcCode = /\b\w{3}\/?\d{6}\/?\d{4}\w?\b/g;
      var html = $.html();

      it('should exist', function() {
        expect(html.match(rePrcCode)).to.exist;
      });

      it('should have no more than two instances', function(){
        expect(html.match(rePrcCode)).to.have.length.of.at.least(1).and.at.most(2);
      });

    });

  });

  
}



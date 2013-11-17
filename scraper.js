'use strict';
/**
 * Web Scraper
 */
// Instead of the default console.log, you could use your own augmented console.log !
var console = require('./console');

// Url regexp from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
var EXTRACT_URL_REG = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
var PORT            = 3000;

//require mongoose module 
var mongoose = require( 'mongoose' );

var request = require('request');

// You should (okay: could) use your OWN implementation here!
var EventEmitter = require('events').EventEmitter;

// We create a global EventEmitter 
var em = new EventEmitter();

//create two queue
var queue = require('./queue');
var crawled = new queue();
queue = new queue();

//import url model
var Urls = require('./models/Urls.js');

//connect to database
mongoose.connect('mongodb://localhost/urls');

/**
 * Get the page from `page_url`
 * @param  {String} page_url String page url to get
 *
 * `get_page` will emit
 */
function get_page(page_url){
  if(page_url == "")
  em.emit('page:scraping', page_url);

  // See: https://github.com/mikeal/request
  request({
    url:page_url,
  }, function(error, http_client_response, html_str){
     
    if(error){
      em.emit('page:error', page_url, error); //display error
      em.emit('next');
      return
    }
    //show the http header 
    show_http_head(http_client_response.statusCode,
              http_client_response._readableState.defaultEncoding,
              http_client_response.headers.server, 
              http_client_response.headers['content-type'],
              http_client_response.headers['content-length']
    );
    em.emit('page', page_url, html_str);
  });
}

/**
 * Extract links from the web pagr
 * @param  {String} html_str String that represents the HTML page
 *
 * `extract_links` should emit an `link(` event each
 */
function extract_links(page_url, html_str){
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  // "match" can return "null" instead of an array of url
  // So here I do "(match() || []) in order to always work on an array (and yes, that's another pattern).
  (html_str.match(EXTRACT_URL_REG) || []).forEach(function(url){
    if(crawled.indexOf(url) < 0){
      // Add the url to the queue
      em.emit('url', page_url, html_str, url);
    }
    else{
      console.log("Already get it !");
    }
  });
  em.emit('next');
}

//push new url into waiting queue and save link into the database
function handle_new_url(from_page_url, from_page_str, url){
  // Add the url to the queue
  queue.push(url);
  //now add the to the database
  new Urls({"url": url}).save();

}

//Extract link from the next queue item
function get_next_page(){
  //let's ride to the next item
  if(!queue.isEmpty()){
    var next = queue.shift();
    crawled.push(next);
    get_page(next);
  }
  else console.log("No more link ! waiting for an other entry point");
}

//function to show server information
function show_http_head(statuscode, defaultEncoding, server, content_type, content_length){
    console.info('Encoding: ' + defaultEncoding + 
           '\n Server: ' + server + 
           '\n StatusCode: ' + statuscode +
           '\n Content-Type: ' + content_type + 
           '\n Content-Length: ' + content_length
    ); 
}

em.on('page:scraping', function(page_url){
  console.log('Loading... ', page_url);
});

// Listen to events, see: http://nodejs.org/api/all.html#all_emitter_on_event_listener
em.on('page', function(page_url, html_str){
  console.log('We got a new page!', page_url);
});

em.on('page:error', function(page_url, error){
  console.error('Oops an error occured on', page_url, ' : ', error);
});


em.on('page', extract_links);

em.on('url', function(page_url, html_str, url){
  console.log('We got a link! ', url);
});

em.on('url', handle_new_url);

em.on('next', function(){
  console.log("Let's ride to the next link !");
});

em.on('next', get_next_page);

//use api module
var api = require('./api')(queue, crawled, get_page, PORT);

//debug
get_page("http://fr.wikipedia.org/wiki/Roger_Federer");

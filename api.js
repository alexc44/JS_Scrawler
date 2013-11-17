// A simple (non-REST) API
// - adding/removing urls to scrape
// - monitoring the crawler state
// - providing statistics like
//    - the top 100 domain name your crawler has see
//    - the average number of link by page on the web
//    - the most used top-level-domain (TLD: http://en.wikipedia.org/wiki/Top-level_domain )
//    - ...

//add some parameters to make possible to the api to use crawler list, function and add the possibility to change listening port
module.exports = function(queue, crawled, get_page, PORT){


  // See: http://expressjs.com/guide.html
  var express         = require('express');
  var app             = express();
  var Urls = require('./models/Urls.js');

  //Index doc
  app.get('/', function(req, res){
    // See: http://expressjs.com/api.html#res.json
    res.json(200, {
      title:'YOHMC - Your Own Home Made Crawler',
      endpoints:[{
        url:'http://127.0.0.1:'+PORT+'/queue/size',
        details:'the current crawler queue size'
      }, {
        url:'http://127.0.0.1:'+PORT+'/queue/add?url=http%3A//voila.fr',
        details:'immediately start a `get_page` on voila.fr.'
      }, {
        url:'http://127.0.0.1:'+PORT+'/queue/list',
        details:'the current crawler queue list.'
      }]
    });
  });

  //return the queue size into a JSON
  app.get('/queue/size', function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.json(200, {queue:{length:queue.length}});
  });

  //call this route to add an url
  app.get('/queue/add', function(req, res){
    var url = req.param('url');
    get_page(url);
    res.json(200, {
      queue:{
        added:url,
        length:queue.length,
      }
    });
  });

  //call this route to add an url
  app.get('/queue/remove', function(req, res){
    var url = req.param('url');
    res.json(200, {
      queue:{
        removed:url,
        result: queue.remove(url),
      }
    });
  });

  //call this route to get the JSON with all our URL
  app.get('/queue/list', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(200, {
      queue:{
        length:queue.length,
        urls:queue
      }
    });
  });

  app.get('/crawled/list', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.json(200, {
      crawled:{
        length:crawled.length,
        urls:crawled
      }
    });
  });

  //number of link per page
  app.get('/statistics/link/per-page', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(200, {
      statistics:{
        date: new Date(),
        length: queue.length/crawled.length,
      }
    });
  });

  //get the total of link crawled (include doublon)
  app.get('/statistics/link/total', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    Urls.count({}, function (err, urls) {
        res.json(200, {
          statistics:{
            total: urls,
          }
        });      
    });
  });

  app.get('/db/urls', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    Urls.find({}, function (err, urls) {
        res.json(200, {
          database:{
            total: urls,
          }
        });      
    });
  });

  //start listening on PORT
  app.listen(PORT);
  console.log('Web UI Listening on port '+PORT);
};
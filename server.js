'use strict';

var express = require('express');
var jsdom   = require('jsdom');
var request = require('superagent');

var server = express();
var PORT = process.env.PORT || 9000;


server.get('/scrape', function(req, res) {
  var url = req.query.url;
  console.log("Scraping URL: %s", url);

  request
    .get(url, function(err, page) {
      if (err) {
        throw err;
      }
      jsdom.env(
        page.text,
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
          var $ = window.$;

          var places = [];

          $("*").each(function() {
            var $t = $(this);
            var cl = $t.attr('class');
            var $sib;
            if (cl && cl.indexOf('address') > -1) {
              $sib = $t.siblings('h1,h2,h3,h4');
              places.push({
                title: $sib.text(),
                address: $t.text()
              });
            }
          });
          res.send(places);
        }
      );
    });
});

console.log("Server listening on port %d", PORT);
server.listen(PORT);
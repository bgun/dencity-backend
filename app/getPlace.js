'use strict';

var url     = require('url');
var jsdom   = require('jsdom');
var request = require('superagent');

var isAddress = function(str) {
};

var hasAddress = function(str) {
};

module.exports = function getPlaces(web_url) {
  return new Promise(function(resolve, reject) {

    var parsedUrl = url.parse(web_url);
    var host = parsedUrl.hostname;

    jsdom.env({
      url: web_url,
      scripts: ["http://code.jquery.com/jquery.js"],
      done: function (err, window) {
        var $ = window.$;
        console.log('Fetching from: %s', host);

        $.expr[':'].regex = function(elem, index, match) {
          var matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
              method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
              property: matchParams.shift().replace(validLabels,'')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g,''), regexFlags);
          return regex.test($(elem)[attr.method](attr.property));
        };

        var name = '';
        var address = '';
        var address_method = '';
        var lat;
        var lon;

        var $h1 = $("h1");
        switch($h1.length) {
          case 0:
            name = "no h1 tag";
          case 1:
            $h1 = $h1.first();
            break;
          default:
            $h1 = $h1.last();
        }

        if ($h1.children().length > 1) {
          name = $h1.children().first().text();
        } else {
          name = $h1.first().text();
        }

        var $p1 = $h1.parent();
        var $p2 = $p1.parent();
        var $p3 = $p2.parent();

        $p2.find('*').filter(function() {
          return this.className.match(/address/);
        }).first().each(function() {
          address = $(this).text();
          address_method = 'carat';
        });
        if (!address) {
          $p2.find('address').each(function() {
            address = $(this).text();
            address_method = 'tag';
          });
        }
        if (!address) {
          address = $('body').find('[class^=address]').text();
          address_method = 'global class';
        }
        if (!address) {
          address = $('body').find('[class^=location]').text();
          address_method = 'global location class';
        }

        $('meta[itemprop="address"]').each(function() {
          var addr = [];
          $(this).children().each(function() {
            addr.push($(this).attr('content'));
          });
          address = addr;
          address_method = 'schema';
        });
        $('meta[itemprop="latitude"]').each(function() {
          lat = $(this).attr('content');
        });
        $('meta[itemprop="longitude"]').each(function() {
          lon = $(this).attr('content');
        });



        resolve({
          name    : name.trim(),
          address : address.trim(),
          host    : host,
          lat     : lat,
          lon     : lon,
          // test
          address_method: address_method
        });
      }
    }); // end jsdom.env
  }); // end promise
}

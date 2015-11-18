'use strict';

var fs      = require('fs');
var url     = require('url');
var jsdom   = require('jsdom');
var qs      = require('qs');

var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

module.exports = function getPlaces(web_url) {
  return new Promise(function(resolve, reject) {

    var parsedUrl = url.parse(web_url);
    var host = parsedUrl.hostname;

    jsdom.env({
      url: web_url,
      src: jquery,
      done: function (err, window) {
        var $ = window.$;
        console.log('Fetching from: %s', host);

        let result = {};
        let name = '';
        let address = '';
        let address_method = '';
        let addr = [];
        let lat;
        let lon;
        let latlon_method;

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

        // Parse links to Google Maps which contain lat/lon
        $('*').each(function() {
          var $t = $(this);
          var href, href_parsed, query, ll;
          if ($t.attr('href')) {
            href = $t.attr('href');
          } else if($t.attr('src')) {
            href = $t.attr('src');
          } else if($t.attr('data-src')) {
            href = $t.attr('data-src');
          }
          if (href && href.indexOf('maps.google') > -1) {
            href_parsed = url.parse(href);
            query = qs.parse(href_parsed.query);
            console.log(host+" | "+href);
            if (query.center) {
              ll = query.center.split(',');
              lat = ll[0];
              lon = ll[1];
              latlon_method = "map link";
            }
          }
        });

        // Microformats
        $('*[itemprop="address"]').find('*').each(function() {
          if ($(this).attr('itemprop')) {
            addr.push($(this).attr('content') || $(this).text());
          }
          address = addr.join(' ').trim();
          address_method = 'schema';
        });
        $('*[itemprop="latitude"]').each(function() {
          lat = $(this).attr('content') || $(this).text();
          latlon_method = "schema";
        });
        $('*[itemprop="longitude"]').each(function() {
          lon = $(this).attr('content') || $(this).text();
          latlon_method = "schema";
        });

        // JSON-LD - unlikely but awesome if they have it
        $('script[type="application/ld+json"]').each(function() {
          var ld = JSON.parse($(this).text());
          if (ld.address) {
            address = [
              ld.address.streetAddress,
              ld.address.addressRegion,
              ld.address.addressLocality
            ].join(' ').trim();
            address_method = 'ld+json';
          }
          if (ld.geo) {
            lat = ld.geo.latitude;
            lon = ld.geo.longitude;
            latlon_method = "ld+json";
          }
        });

        // opengraph
        $('meta[property$=":location:latitude"]').each(function() {
          lat = $(this).attr('content');
          latlon_method = "opengraph";
        });
        $('meta[property$=":location:longitude"]').each(function() {
          lon = $(this).attr('content');
          latlon_method = "opengraph";
        });

        // last resort: let's go hunting
        if (!address) {
          address = "";
          $p2.find('*').each(function() {
            if ($(this).attr('class') && $(this).attr('class').match(/address/i)) {
              address += $(this).text();
              address_method = 'match class: '+$(this).attr('class');
            }
          });
        }
        if (!address) {
          address = "";
          $p2.find('*').each(function() {
            if ($(this).attr('id') && $(this).attr('id').match(/address/i)) {
              address += $(this).text();
              address_method = 'match id: '+$(this).attr('id');
            }
          });
        }
        if (!address) {
          address = "";
          $p3.find('address').each(function() {
            address += $(this).text();
            address_method = 'tag';
          });
        }

        result = {
          name    : name.trim(),
          address : address,
          host    : host,
          lat     : lat,
          lon     : lon,
          meta: {
            address_method : address_method,
            latlon_method  : latlon_method
          }
        };
        resolve(result);
      }
    }); // end jsdom.env
  }); // end promise
}

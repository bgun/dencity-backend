'use strict';

var express = require('express');

var getPlace = require('./app/getPlace.js');

var server = express();
var PORT = process.env.PORT || 9099;


server.get('/getPlace', function(req, res) {

  getPlace(req.query.url)
    .then(function(place) {
      res.send(place);
    })
    .catch(function(err) {
      console.error(err);
    });

});

server.get('/testGetPlace', function(req, res) {
  var tests = [
     'http://www.agoda.com/the-opposite-house-hotel/hotel/beijing-cn.html'
    ,'http://www.booking.com/hotel/cn/the-opposite-house.html'
    ,'https://citymaps.com/v/cn/be/beijing/%E7%91%9C%E8%88%8D-the-opposite-house/c0fd07c0-dcff-415b-83ec-2fe9a818b5e0'
    ,'http://www.expedia.com/Beijing-Hotels-The-Opposite-House.h2191786.Hotel-Information'
    ,'http://www.hotelclub.com/pt_pt/hot%C3%A9is/China/Pequim/The_Opposite_House.h287182/'
    ,'http://www.hotels.com/hotel/details.html?hotel-id=274069'
    ,'http://www.hoteltravel.com/china/beijing/opposite_house.htm'
    ,'http://www.orbitz.com/hotel/China/Beijing/The_Opposite_House.h287182/'
    ,'http://www.preferredhotels.com/destinations/beijing/the-opposite-house'
    ,'http://www.priceline.com/hotel/hotelOverviewGuide.do?propID=11097705'
    ,'http://www.tablethotels.com/The-Opposite-House-Beijing-Hotel/Beijing-Hotels-China/103877/'
    ,'http://www.tripadvisor.com/Hotel_Review-g294212-d1144145-Reviews-The_Opposite_House-Beijing.html'
    ,'http://www.travelocity.com/Beijing-Hotels-Rosewood-Beijing.h1514763.Hotel-Information?rm1=a2&sp=KygIKjE7PWVuYGh2aWt-KygbMDMRNmV-KygIKjE7PRsXZWpubnZvan4rKBswMxctLGU.&'
    ,'http://www.yelp.com/biz/babbo-new-york'
    ,'https://en.wikipedia.org/wiki/Amsterdam'
  ];
  var promises = tests.map(function(test) {
    return getPlace(test);
  });
  Promise.all(promises)
    .then(function(results) {
      res.send(results);
    });
});

console.log("Server listening on port %d", PORT);
server.listen(PORT);

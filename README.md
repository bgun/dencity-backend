places-scraper
==============

### getPlace
Ingests a URL and outputs the name, address, lat/lon of the place referenced by the page.

Example:

    /getPlace?url=http://www.yelp.com/biz/empire-state-building-new-york-2

Params:
 + `url`: The URL to scrape.

Todo:
 + Title from schema, jsonld, open graph 
 + Address from Google maps daddr
 + Walk DOM and calculate best geonames match

Test:
 + Google places 
 + Pinterest
 + Facebook page
 + Google+ page
 + Bing

import request from 'superagent';

var FSQ_BASE_URL = 'https://api.foursquare.com/v2/venues/explore';

var DEFAULT_PARAMS = {
  limit  : 200,         // 4sq default is 10
  ll     : [40.74,-74],
  query  : 'pizza',
  radius : 500          // in meters, 4sq default is 250
};

export default function scrapeFsqExplore() {
  return new Promise(function(resolve, reject) {
    resolve([
      1, 2, 3
    ]);
  });
}
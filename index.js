var assert = require('assert')
var networkmatch = require('networkmatch')

module.exports = function match (data, threshold, cb) {
  assert.deepEqual(data.type, 'FeatureCollection')
  // default threshold of 1m
  threshold = threshold || 0.0001

  data.features.forEach(function (feature) {
    feature._id = feature.properties.name
  });
  networkmatch.index(data)
  var results = data.features.map(matchFeature)
  cb(null, results)

  function matchFeature (feature) {
    return networkmatch.match(feature, threshold)
  }
}

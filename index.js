var path = require('path')
var assert = require('assert')
var linematch = require('linematch')
var lineDistance = require('turf-line-distance')
var multiLinestring = require('turf-multilinestring')

module.exports = function match (data, threshold, cb) {
  assert.deepEqual(data.type, 'FeatureCollection')
  // default threshold of 1m
  threshold = threshold || 0.0001

  var { features } = data
  // create an array of coordinates to compare each line against
  var segments = features.map(f => f.geometry.coordinates)
  var results = features.map(matchLine)

  function matchLine (feature, i) {
    // compare the feature against the corpus, minus the feature itself
    var seg1 = [feature.geometry.coordinates]
    var seg2 = segments.slice()
    seg2.splice(i, 1)

    var distance = lineDistance(feature)
    var diff = multiLinestring(linematch(seg1, seg2, threshold))
    var unmatched = lineDistance(diff)
    var ratio = unmatched / distance
    return ratio
  }

  cb(null, results)
}

'use strict'

var assert = require('assert')
var match = require('networkmatch')
var hat = require('hat')
var rack = hat.rack()

// 1m precision
var THRESHOLD = 0.0001;

module.exports = function generate (data, cb) {
  assert.deepEqual(data.type, 'FeatureCollection')
  assert.ok(Array.isArray(data.features))

  // Assign a unique id to each feature, and assign it to a map
  var map = new Map()
  data.features.forEach(feature => {
    let id = rack()
    feature._id = id
    map.set(id, feature)
  })

  function matchFeature (feature) {
    // [ [ [segmentStart], [segmentEnd], id ] ... ]
    var collisions = match.match(feature, THRESHOLD)
    if (collisions.length) {
      let features = collisions.map(c => map.get(c[2]))
      return Object.assign({_collisions: features}, feature)
    }
    return null
  }

  // Index our features
  match.index(data)

  var result = data.features.map(matchFeature).filter(Boolean)
  return cb(null, result)
}

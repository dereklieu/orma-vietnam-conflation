'use strict'

var assert = require('assert')
var match = require('networkmatch')
var hat = require('hat')
var rack = hat.rack()
var linestring = require('turf-linestring')

// 50m threshold
var THRESHOLD = 0.005

module.exports = function detect (data, cb) {
  assert.deepEqual(data.type, 'FeatureCollection')
  assert.ok(Array.isArray(data.features))

  // Assign a unique id to each feature, and assign it to a map
  var map = new Map()
  data.features.forEach(feature => {
    let id = rack()
    feature._id = id
    map.set(id, feature)
  })

  function lookForIntersections (feature) {
    var start = linestring(feature.geometry.coordinates.slice(0, 2))
    var end = linestring(feature.geometry.coordinates.slice(-2, 0))

    var collisions = match.match(start, THRESHOLD).concat(match.match(end, THRESHOLD))

    if (collisions.length) {
      let features = collisions.map(c => map.get(c[2]))
      return Object.assign({_collisions: features}, feature)
    }
    return null
  }

  match.index(data)
  var result = data.features.map(lookForIntersections).filter(Boolean)
  return cb(null, result)
}

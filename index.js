'use strict'

var fs = require('fs')
var path = require('path')
var express = require('express')
var cors = require('cors')
var generateConflation = require('./lib/generate-conflation')

var PORT = 3010

function createServer (collisions) {
  var server = express()
  server.use(cors())
  server.get('/collisions', (req, res) => {
    res.json(collisions.map(c => c._id))
  })
  server.get('/collision/:id', (req, res) => {
    let record = collisions.find(c => c._id === req.params.id)
    if (!record) res.status(404).end()
    else res.json(record)
  })
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server running on port', PORT)
  })
}

// eslint-disable-next-line no-undef
fs.readFile(path.join(__dirname, 'data/sample.geojson'), (err, file) => {
  if (err) { throw new Error(err) }
  var network = JSON.parse(file)
  generateConflation(network, (err, collisions) => {
    if (err) { throw new Error(err) }
    createServer(collisions)
  })
})

const fs = require('fs')
const { posix: path } = require('path')

const factory = require('./index.js')
module.exports = factory({ fs, path })

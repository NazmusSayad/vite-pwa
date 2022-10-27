console.clear()
process.env.NODE_ENV = 'production'
const { default: local } = require('../dist/cjs/index.js')
console.log(local())
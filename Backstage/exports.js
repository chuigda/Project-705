const uidFunctions = require('./base/uid')
const gameContextFunctions = require('./executor/connect')

module.exports = {
   ...uidFunctions,
   ...gameContextFunctions
}

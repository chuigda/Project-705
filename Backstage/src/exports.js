const uidFunctions = require('./base/uid')
const connectThings = require('./executor/connect')
const computeFunctions = require('./executor/compute')

module.exports = {
   ...uidFunctions,
   ...connectThings,
   ...computeFunctions
}

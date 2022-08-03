const uidFunctions = require('./base/uid')
const gameContextFunctions = require('./base/game_context_fn')

module.exports = {
   ...uidFunctions,
   ...gameContextFunctions
}

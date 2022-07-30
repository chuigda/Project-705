const { updatePlayerProperty } = require('../../../base/game_context_fn')

module.exports = {
   ident: 'learn_from_the_past_gain',
   event: [
      gameContext => {
         const { skills } = gameContext.player
         const skillCount = skills.length
         updatePlayerProperty(gameContext, 'skillPoints', 'add', skillCount * 2)
      }
   ]
}

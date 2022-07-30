const { connect,
   signals
} = require('../../base/game_context_fn')
module.exports = {
   ident: 'learn_from_the_past',
   name: '$ap_learn_from_the_past',
   description: '$ap_learn_from_the_past_desc',
   potential: [
      {
         op: 'or',
         arguments: [
            {
               op: gameContext => {
                  return gameContext.turns >= 10
               },
               description: '$ap_learn_from_the_past_potential_desc1'
            },
            {
               op: gameContext => {
                  return gameContext.player.skills
                      .filter(skill => skill.category !== 'init_skills')
                      .length >= 15
               },
               description: '$ap_learn_from_the_past_potential_desc2'
            }
         ]
      }
   ],
   events: [
      gameContext => {
         connect(gameContext, signals.turnStart(), 'learn_from_the_past_gain')
      }
   ]
}

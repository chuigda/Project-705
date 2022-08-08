const {
   connect,
   signals
} = require('../../src/executor/connect')

module.exports = {
   ident: 'learn_from_the_past',
   name: '$ap_learn_from_the_past',
   description: '$ap_learn_from_the_past_desc',
   potential: [
      {
         op: 'or',
         arguments: [
            {
               op: gameContext => gameContext.turns >= 10,
               description: '$ap_learn_from_the_past_potential_desc1'
            },
            {
               op: gameContext => (
                  Object.values(gameContext.player.skills)
                     .filter(skill => skill.category !== 'init_skills')
                     .length >= 15
               ),
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

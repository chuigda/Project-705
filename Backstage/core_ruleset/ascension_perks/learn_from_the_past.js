module.exports = {
   ident: 'learn_from_the_past',
   name: '$ap_learn_from_the_past',
   description: '$ap_learn_from_the_past_desc',
   potential: {
      $or: [
         {
            turns: { $ge: 10 }
         },
         {
            $function: gameContext => {
                return gameContext.attributes.skills
                   .filter(skill => skill.category !== 'init_skills')
                   .length >= 15
            },
            $description: '$ap_learn_from_the_past_potential_desc',
            $hook: 'player.skills'
         }
      ]
   },
   events: [
      gameContext => gameContext.fn.scheduleEvent(gameContext, 'every_turn_start')
   ]
}

const { updatePlayerProperty } = require('../../executor/properties')

module.exports = {
   ident: 'precautions',

   name: '$ap_precautions',
   description: '$ap_precautions_desc',

   modifier: {
      costReductions: {
         'init_skills': -0.5
      }
   },
   events: [
      gameContext => updatePlayerProperty(gameContext, 'skillPoints', 'add', 500)
   ]
}

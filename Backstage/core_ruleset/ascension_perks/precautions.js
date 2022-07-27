module.exports = {
   ident: 'precautions',

   name: '$ap_precautions',
   description: '$ap_precautions_desc',

   modifier: {
      costReductions: {
         initSkills: -0.5
      }
   },
   events: [
      {
         player: {
            skillPoints: { $add: 500 }
         }
      }
   ]
}

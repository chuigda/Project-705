module.exports = {
   ident: 'precautions',

   name: '$ap_precautions',
   description: '$ap_precautions_desc',

   staticModifiers: {
      costReductions: {
         initSkills: -0.5
      }
   },
   events: [
      {
         trigger: 'activated',
         inlineEvent: (gameContext, ui) => {
            gameContext.attributes.skillPoints += 500
            ui.requestUpdate(ui, 'attributes')
         }
      }
   ]
}

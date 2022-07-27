module.exports = {
   ident: 'learn_from_the_past',
   name: '$ap_learn_from_the_past',
   description: '$ap_learn_from_the_past_desc',
   available: gameContext => {
      return gameContext.player.ascensionPerks.length >= 1 && gameContext.turns >= 11
   },
   events: [
      {
         trigger: 'turn_start',
         inlineEvent: gameContext => {
            const learnedSkills = gameContext.player.skills.length
            gameContext.player.attributes.skillPoints += learnedSkills * 2
         }
      }
   ]
}

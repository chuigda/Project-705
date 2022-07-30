module.exports = {
   ident: 'learn_from_the_past_gain',
   events: [
      gameContext => {
         const { skills } = gameContext.player
         const skillCount = skills.length
         gameContext.updatePlayerAttributes('skillPoints', skillCount * 2)
      }
   ]
}

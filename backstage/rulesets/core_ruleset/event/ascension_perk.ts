import { Event } from '@app/ruleset'

const ascensionPerkEvents: Event[] = [
   {
      ident: 'well_prepared_activation',
      event: [
         gameContext => {
            gameContext.updatePlayerProperty('skillPoints', 'add', 500)
         }
      ]
   },
   {
      ident: 'dont_be_busy_activation',
      event: [
         gameContext => {
            gameContext.connect(gameContext.signals.countDown(10), 'dont_be_busy_boost')
         }
      ]
   },
   {
      ident: 'dont_be_busy_boost',
      event: [
         gameContext => {
            gameContext.updatePlayerProperty('skillPoints', 'add', 1000)
            gameContext.updatePlayerProperty('attributes.charisma', 'add', 300)
            gameContext.removeModifier('dont_be_busy')
            gameContext.addModifier('dont_be_busy_boost')
         }
      ]
   },
   {
      ident: 'defrag_activation',
      event: [
         gameContext => {
            gameContext.connect(gameContext.signals.turnStart(), 'defrag_turnstart')
            gameContext.connect(gameContext.signals.turnOver(), 'defrag_turnover')
         }
      ]
   },
   {
      ident: 'defrag_turnstart',
      event: [
         gameContext => {
            gameContext.setV('defrag_init_value', gameContext.state.player.skillPoints)
         }
      ]
   },
   {
      ident: 'defrag_turnover',
      event: [
         gameContext => {
            gameContext.state.player.attributes.intelligence += 50

            const skillPoints1 = gameContext.getV('defrag_init_value')
            const skillPoints2 = gameContext.state.player.skillPoints

            const diff = skillPoints2 - skillPoints1
            if (diff < 0) {
               gameContext.state.player.skillPoints += Math.ceil(diff / 5)
            } else {
               gameContext.state.player.energy += Math.ceil(diff / 2)
            }
         }
      ]
   },
   {
      ident: 'king_of_involution_activation',
      event: [
         gameContext => {
            gameContext.removeModifier('town_swot')
            gameContext.connect(gameContext.signals.turnStart(), 'king_of_involution_turnstart')
         }
      ]
   },
   {
      ident: 'king_of_involution_turnstart',
      event: [
         gameContext => {
            // TODO 降低来自所有同学的外交评价
         }
      ]
   }
]

export default ascensionPerkEvents

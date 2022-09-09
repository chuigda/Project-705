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

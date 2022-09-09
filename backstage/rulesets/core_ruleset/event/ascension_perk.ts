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
      ident: 'king_of_evolution_activation',
      event: [
         gameContext => {
            gameContext.removeModifier('town_swot')
         }
      ]
   }
]

export default ascensionPerkEvents

import { Event } from '@app/ruleset'

const ascensionPerkEvents: Event[] = [
   {
      ident: 'well_prepared_activation',
      event: cx => {
         cx.updatePlayerProperty('skillPoints', 'add', 500)
      }
   },
   {
      ident: 'dont_be_busy_activation',
      event: cx => {
         cx.connect(cx.signals.countDown(10), 'dont_be_busy_boost')
      }
   },
   {
      ident: 'dont_be_busy_boost',
      event: cx => {
         cx.updatePlayerProperty('skillPoints', 'add', 1000)
         cx.updatePlayerProperty('attributes.charisma', 'add', 300)
         cx.removeModifier('dont_be_busy')
         cx.addModifier('dont_be_busy_boost')
      }
   },
   {
      ident: 'defrag_activation',
      event: cx => {
         cx.connect(cx.signals.turnStart(), 'defrag_turnstart')
         cx.connect(cx.signals.turnOver(), 'defrag_turnover')
      }
   },
   {
      ident: 'defrag_turnstart',
      event: cx => {
         cx.setV('defrag_init_value', cx.state.player.skillPoints)
      }
   },
   {
      ident: 'defrag_turnover',
      event: cx => {
         cx.state.player.attributes.intelligence += 50

         const skillPoints1 = cx.getV('defrag_init_value')
         const skillPoints2 = cx.state.player.skillPoints

         const diff = skillPoints2 - skillPoints1
         if (diff < 0) {
            cx.state.player.skillPoints += Math.ceil(diff / 5)
         } else {
            cx.state.player.energy += Math.ceil(diff / 2)
         }
      }
   },
   {
      ident: 'king_of_involution_activation',
      event: cx => {
         cx.removeModifier('town_swot')
         cx.connect(cx.signals.turnStart(), 'king_of_involution_turnstart')
      }
   },
   {
      ident: 'king_of_involution_turnstart',
      event: cx => {
         // TODO 降低来自所有同学的外交评价
      }
   }
]

export default ascensionPerkEvents

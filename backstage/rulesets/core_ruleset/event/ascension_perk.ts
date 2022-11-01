import { Event, ValueSource } from '@app/ruleset'
import { PropertyOp } from '@app/ruleset/ops'

const ascensionPerkEvents: Event[] = [
   {
      ident: 'well_prepared_activation',
      event: cx => {
         cx.updateProperty('@skill_point', 'add', 500)
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
         cx.updateProperty('@skill_point', 'add', 1000)
         cx.updateProperty('@charisma', 'add', 300)
         cx.removeModifier('dont_be_busy')
         cx.addModifier('dont_be_busy_boost')
      }
   },
   {
      ident: 'go_over_activation',
      event: cx => {
         cx.connect(cx.signals.turnOver(), 'go_over_turnover')
      }
   },
   {
      ident: 'go_over_turnover',
      event: cx => {
         const learntSkillCount = Object.keys(cx.state.player.skills).length

         if (cx.state.turns >= 10) {
            cx.updateProperty('@skill_point', 'add', learntSkillCount * 3)
         } else {
            cx.updateProperty('@skill_point', 'add', Math.ceil(learntSkillCount * 1.5))
         }
      }
   },
   {
      ident: 'defrag_activation',
      event: cx => {
         cx.setV('defrag_counter', 0)
         cx.connect(cx.signals.playerPropertyUpdated('@skill_point'), 'defrag_skill_point_cost')
         cx.connect(cx.signals.turnOver(), 'defrag_turnover')
      }
   },
   {
      ident: 'defrag_skill_point_cost',
      event: (cx, opRef: { operator: PropertyOp, value: number }, source: ValueSource) => {
         if (opRef.operator === 'sub' && source === '@learn_skill') {
            cx.updateV('defrag_counter', counter => counter + opRef.value)
         }
      }
   },
   {
      ident: 'defrag_turnover',
      event: cx => {
         const defragCounter = cx.setV('defrag_counter', 0)
         cx.updateProperty('@skill_point', 'add', Math.ceil(defragCounter / 5))
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

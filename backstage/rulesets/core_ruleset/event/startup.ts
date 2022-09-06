// detroit event scripts
import { GameContext } from '@app/executor/game_context'
import { PropertyOp } from '@app/ruleset/ops'
import { Event } from '@app/ruleset'

const detroitEvents: Event[] = [
   {
      ident: 'detroit_init',
      event: [
         (cx: GameContext) => {
            cx.connect(cx.signals.timer(8), 'detroit_add_attr1')
            cx.connect(cx.signals.timer(24), 'detroit_add_attr2')
            cx.connect(cx.signals.timer(40), 'detroit_add_attr3')

            cx.connect(cx.signals.playerPropertyUpdated('attributes.intelligence'), 'detroit_collect_data1')
            cx.connect(cx.signals.playerPropertyUpdated('attributes.memorization'), 'detroit_collect_data1')
            cx.connect(cx.signals.playerPropertyUpdated('attributes.strength'), 'detroit_collect_data1')
            cx.connect(cx.signals.playerPropertyUpdated('attributes.emotionalIntelligence'), 'detroit_collect_data2')
            cx.connect(cx.signals.playerPropertyUpdated('attributes.imagination'), 'detroit_collect_data2')
            cx.connect(cx.signals.turnStart(), 'detroit_pressure_check')
            cx.connect(cx.signals.turnOver(), 'detroit_pressure_check')

            cx.setV('data_collected', 0)
            cx.setV('software_unstable', 0)
            cx.setV('program_error', 0)
         }
      ]
   },
   {
      ident: 'detroit_collect_data1',
      event: [
         (cx: GameContext, opRef: { operator: PropertyOp, value: number }) => {
            if (opRef.operator === 'add') {
               cx.updateV('data_collected', value0 => value0 + opRef.value / 2)
               opRef.value = 0
            }
         }
      ]
   },
   {
      ident: 'detroit_collect_data2',
      event: [
         (cx: GameContext, opRef: { operator: PropertyOp, value: number }) => {
            if (opRef.operator === 'add') {
               cx.updateV('data_collected', value0 => value0 + opRef.value)
               cx.updateV('software_unstable', value0 => value0 + 1)
               opRef.value = 0
            }
         }
      ]
   },
   {
      ident: 'detroit_pressure_check',
      event: [
         (cx: GameContext) => {
            if (cx.state.player.mentalHealth <= 0) {
               cx.updateV('program_error', value0 => value0 + 1)
            }
         }
      ]
   },
   {
      ident: 'detroit_add_attr1',
      event: [
         (cx: GameContext) => {
            // not using `updatePlayerProperties` here because we don't want to be hooked
            cx.state.player.attributes.intelligence += 2000
            cx.state.player.attributes.emotionalIntelligence += 500
            cx.state.player.attributes.strength += 500
            cx.state.player.attributes.imagination += 250
         }
      ]
   },
   {
      ident: 'detroit_add_attr2',
      event: [
         (cx: GameContext) => {
            cx.state.player.attributes.intelligence += 4000
            cx.state.player.attributes.emotionalIntelligence += 500
            cx.state.player.attributes.strength += 1000
            cx.state.player.attributes.imagination += 250
         }
      ]
   },
   {
      ident: 'detroit_add_attr3',
      event: [
         (cx: GameContext) => {
            cx.state.player.attributes.intelligence += 8000
            cx.state.player.attributes.emotionalIntelligence += 500
            cx.state.player.attributes.strength += 2000
            cx.state.player.attributes.imagination += 250
         }
      ]
   }
]

const startupEvents = [
   ...detroitEvents
]

export default startupEvents

import { PropertyOp } from '@app/ruleset/ops'
import { Event } from '@app/ruleset'

const detroitEvents: Event[] = [
   {
      ident: 'detroit_init',
      event: cx => {
         cx.connect(cx.signals.timer(8), 'detroit_add_attr1')
         cx.connect(cx.signals.timer(24), 'detroit_add_attr2')
         cx.connect(cx.signals.timer(40), 'detroit_add_attr3')

         cx.connect(cx.signals.propertyUpdated('attributes.intelligence'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('attributes.memorization'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('attributes.strength'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('attributes.emotionalIntelligence'), 'detroit_collect_data2')
         cx.connect(cx.signals.propertyUpdated('attributes.imagination'), 'detroit_collect_data2')
         cx.connect(cx.signals.turnStart(), 'detroit_pressure_check')
         cx.connect(cx.signals.turnOver(), 'detroit_pressure_check')

         cx.initProperty('data_collected', 0)
         cx.initProperty('software_unstable', 0)
         cx.initProperty('program_error', 0)
      }
   },
   {
      ident: 'detroit_collect_data1',
      event: (cx, opRef: { operator: PropertyOp, value: number }) => {
         if (opRef.operator === 'add') {
            cx.updateV('data_collected', value0 => value0 + opRef.value / 2)
            opRef.value = 0
         }
      }
   },
   {
      ident: 'detroit_collect_data2',
      event: (cx, opRef: { operator: PropertyOp, value: number }) => {
         if (opRef.operator === 'add') {
            cx.updateV('data_collected', value0 => value0 + opRef.value)
            cx.updateV('software_unstable', value0 => value0 + 1)
            opRef.value = 0
         }
      }
   },
   {
      ident: 'detroit_pressure_check',
      event: cx => {
         if (cx.getPropertyValue('@mental_health')! <= 0) {
            cx.updateV('program_error', value0 => value0 + 1)
         }
      }
   },
   {
      ident: 'detroit_add_attr1',
      event: cx => {
         cx.updateProperty('@intelligence', 'add', 2000, '@detroit_add_attr')
         cx.updateProperty('@emotional_intelligence', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@strength', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@imagination', 'add', 250, '@detroit_add_attr')
      }
   },
   {
      ident: 'detroit_add_attr2',
      event: cx => {
         cx.updateProperty('@intelligence', 'add', 4000, '@detroit_add_attr')
         cx.updateProperty('@emotional_intelligence', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@strength', 'add', 1000, '@detroit_add_attr')
         cx.updateProperty('@imagination', 'add', 250, '@detroit_add_attr')
      }
   },
   {
      ident: 'detroit_add_attr3',
      event: cx => {
         cx.updateProperty('@intelligence', 'add', 8000, '@detroit_add_attr')
         cx.updateProperty('@emotional_intelligence', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@strength', 'add', 2000, '@detroit_add_attr')
         cx.updateProperty('@imagination', 'add', 250, '@detroit_add_attr')
      }
   }
]

const startupEvents = [
   ...detroitEvents
]

export default startupEvents

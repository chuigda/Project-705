import { PropertyOp } from '@app/ruleset/ops'
import { Event } from '@app/ruleset'
import { attributeIdList } from '@protocol/player'
import { initProperty } from '@app/executor/property'

const detroitEvents: Event[] = [
   {
      ident: 'normal_init',
      event: cx => {
         for (const attributeId of attributeIdList) {
            cx.updateProperty(attributeId, 'set_incr', 20, '@init')
         }
      }
   },
   {
      ident: 'gifted_init',
      event: cx => {
         for (const attributeId of attributeIdList) {
            cx.updateProperty(attributeId, 'set_incr', 50, '@init')
         }
         cx.updateProperty('@skill_point', 'add', 500, '@init')
      }
   },
   {
      ident: 'poor_init',
      event: cx => {
         initProperty(cx, '@mental_health', { name: '@', value: 75, min: 0, max: 150 })
      }
   },
   {
      ident: 'detroit_init',
      event: cx => {
         cx.connect(cx.signals.timer(8), 'detroit_add_attr1')
         cx.connect(cx.signals.timer(24), 'detroit_add_attr2')
         cx.connect(cx.signals.timer(40), 'detroit_add_attr3')

         cx.connect(cx.signals.propertyUpdated('@intelligence'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('@memorization'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('@strength'), 'detroit_collect_data1')
         cx.connect(cx.signals.propertyUpdated('@emotional_intelligence'), 'detroit_collect_data2')
         cx.connect(cx.signals.propertyUpdated('@imagination'), 'detroit_collect_data2')
         cx.connect(cx.signals.turnStart(), 'detroit_pressure_check')
         cx.connect(cx.signals.turnOver(), 'detroit_pressure_check')

         cx.connect(cx.signals.propertyUnderflow('@mental_health'), 'detroit_add_program_error')

         cx.updateProperty('@intelligence', 'add', 2000, '@detroit_add_attr')
         cx.updateProperty('@emotional_intelligence', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@strength', 'add', 500, '@detroit_add_attr')
         cx.updateProperty('@imagination', 'add', 250, '@detroit_add_attr')

         cx.initPropertySimple('data_collected', '$pr_data_collected', 0)
         cx.initPropertySimple('software_unstable', '$pr_software_unstable', 0)
         cx.initPropertySimple('program_error', '$pr_program_error', 0)
      }
   },
   {
      ident: 'detroit_collect_data1',
      event: (cx, opRef: { operator: PropertyOp, value: number }, source: string) => {
         if (source.startsWith('@detroit')) {
            return
         }
         if (opRef.operator === 'add') {
            cx.updateProperty('data_collected', 'add', Math.ceil(opRef.value / 2), '@detroit_data_collect')
            opRef.value = 0
         }
      }
   },
   {
      ident: 'detroit_collect_data2',
      event: (cx, opRef: { operator: PropertyOp, value: number }, source: string) => {
         if (source.startsWith('@detroit')) {
            return
         }
         if (opRef.operator === 'add') {
            cx.updateProperty('data_collected', 'add', Math.ceil(opRef.value / 2), '@detroit_data_collect')
            cx.updateProperty('software_unstable', 'add', 1, '@detroit_data_collect')
            opRef.value = 0
         }
      }
   },
   {
      ident: 'detroit_add_program_error',
      event: cx => {
         cx.updateProperty('program_error', 'add', 1)
         cx.updateProperty(
            '@mental_health',
            'add',
            Math.ceil(cx.getProperty('@mental_health')!.max! / 3)
         )
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

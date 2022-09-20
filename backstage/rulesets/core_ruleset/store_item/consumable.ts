import { ConsumableItem } from '@app/ruleset'

const consumableItems: ConsumableItem[] = [
   {
      ident: 'cola',
      name: '$si_cola',
      description: '$si_cola_desc',
      kind: 'consumable',
      price: 3,
      consumeEvents: ['drink_cola']
   },
   {
      ident: 'firework_bunch',
      name: '$si_firework_bunch',
      description: '$si_firework_bunch_desc',
      kind: 'consumable',
      price: 15,
      consumeEvents: ['play_firework']
   },
   {
      ident: 'ultraman_card_pack',
      name: '$si_ultraman_card_pack',
      description: '$si_ultraman_card_pack_desc',
      kind: 'consumable',
      price: 20,
      consumeEvents: ['suoha_suoha_suoha']
   },
   {
      ident: 'five_three',
      name: '$si_five_three',
      description: '$si_five_three_desc',
      kind: 'consumable',
      level: 'epic',
      price: 150,
      energyCost: 40,
      initCharge: 10,
      consumeEvents: ['play_with_five_three'],
   },
   {
      ident: 'hg_exam_overlord',
      name: '$si_hg_exam_overlord',
      description: '$si_hg_exam_overlord_desc',
      kind: 'consumable',
      level: 'legend',
      price: 600,
      energyCost: 60,
      initCharge: 4,
      consumeEvents: ['play_with_hg_exam_overlord'],
   }
]

export default consumableItems

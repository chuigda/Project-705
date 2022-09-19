import { ConsumableItem } from '@app/ruleset'

const consumableItems: ConsumableItem[] = [
   {
      ident: 'cola',
      name: '$si_cola',
      description: '$si_cola_desc',
      itemKind: 'consumable',
      price: 3,
      events: ['drink_cola'],
      initCharge: 1
   },
   {
      ident: 'firework_bunch',
      name: '$si_firework_bunch',
      description: '$si_firework_bunch_desc',
      itemKind: 'consumable',
      price: 15,
      events: ['play_firework'],
      initCharge: 1
   },
   {
      ident: 'ultraman_card_pack',
      name: '$si_ultraman_card_pack',
      description: '$si_ultraman_card_pack_desc',
      itemKind: 'consumable',
      price: 20,
      events: ['suoha_suoha_suoha'],
      initCharge: 1
   },
   {
      ident: 'five_three',
      name: '$si_five_three',
      description: '$si_five_three_desc',
      itemKind: 'consumable',
      price: 150,
      events: ['play_with_five_three'],
      energyCost: 40,
      initCharge: 15
   },
   {
      ident: 'hg_exam_overlord',
      name: '$si_hg_exam_overlord',
      description: '$si_hg_exam_overlord_desc',
      itemKind: 'consumable',
      price: 600,
      events: ['play_with_hg_exam_overlord'],
      energyCost: 60,
      initCharge: 4
   }
]

export default consumableItems

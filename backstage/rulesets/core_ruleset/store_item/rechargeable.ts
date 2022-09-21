import { RechargeableItem } from '@app/ruleset'

const rechargeableItems: RechargeableItem[] = [
   {
      ident: 'school_test_lv1',
      name: '$si_school_test_lv1',
      description: '$si_school_test_lv1_desc',
      kind: 'rechargeable',
      energyCost: 35,
      consumeEvents: ['do_school_test_v1'],
      initCharge: 1,
      maxCharge: 2
   },
   {
      ident: 'school_test_lv2',
      name: '$si_school_test_lv2',
      description: '$si_school_test_lv2_desc',
      kind: 'rechargeable',
      energyCost: 45,
      consumeEvents: ['do_school_test_v2'],
      initCharge: 1,
      maxCharge: 3
   }
]

export default rechargeableItems

import { RechargeableItem } from '@app/ruleset'

const rechargeableItems: RechargeableItem[] = [
   {
      ident: 'school_test_lv1',
      name: '$si_school_test_lv1',
      description: '$si_school_test_lv1_desc',
      itemKind: 'rechargeable',
      events: ['do_school_test_v1'],
      initCharge: 2,
      maxCharge: 2,
      energyCost: 25
   },
   {
      ident: 'school_test_lv2',
      name: '$si_school_test_lv2',
      description: '$si_school_test_lv2_desc',
      itemKind: 'rechargeable',
      events: ['do_school_test_v2'],
      initCharge: 3,
      maxCharge: 3,
      energyCost: 35
   }
]

export default rechargeableItems

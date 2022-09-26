import { TradableItem } from '@app/ruleset'

const tradableItems: TradableItem[] = [
   {
      ident: 'ultraman_card_n',
      name: '$si_ultraman_card_n',
      description: '$si_ultraman_card_n_desc',
      kind: 'tradable',
      sellValue: 1
   },
   {
      ident: 'ultraman_card_r',
      name: '$si_ultraman_card_r',
      description: '$si_ultraman_card_r_desc',
      kind: 'tradable',
      level: 'rare',
      sellValue: 2
   },
   {
      ident: 'ultraman_card_sr',
      name: '$si_ultraman_card_sr',
      description: '$si_ultraman_card_sr_desc',
      kind: 'tradable',
      level: 'epic',
      sellValue: 10
   },
   {
      ident: 'ultraman_card_ssr',
      name: '$si_ultraman_card_ssr',
      description: '$si_ultraman_card_ssr_desc',
      kind: 'tradable',
      level: 'legend',
      sellValue: 100
   }
]

export default tradableItems

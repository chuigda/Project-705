import { ActiveRelicItem } from '@app/ruleset'

const activeRelicItems: ActiveRelicItem[] = [
   {
      ident: 'hextech_power_generator',
      name: '$si_hextech_power_generator',
      description: '$si_hextech_power_generator_desc',

      kind: 'active_relic',
      level: 'epic',
      cooldown: 5,
      activateEvents: ['hextech_generate_power']
   }
]

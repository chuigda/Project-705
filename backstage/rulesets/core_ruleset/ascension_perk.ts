import { AscensionPerk } from '@app/ruleset'
import { turnsLater } from '@rulesets/core_ruleset/common_potential'

const ascensionPerks: AscensionPerk[] = [
   {
      ident: 'well_prepared',
      name: '$ap_well_prepared',
      description: '$ap_well_prepared_desc',
      events: ['well_prepared_activation']
   },
   {
      ident: 'town_swot',
      name: '$ap_town_swot',
      description: '$ap_town_swot_desc',
      potential: [turnsLater(12)]
   }
]

export default ascensionPerks

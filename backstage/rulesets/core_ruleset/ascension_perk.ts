import { AscensionPerk } from '@app/ruleset'
import {
   requireAscensionPerk,
   requireStartupNot,
   turnsLater
} from '@rulesets/core_ruleset/common_potential'

const ascensionPerks: AscensionPerk[] = [
   {
      ident: 'well_prepared',
      name: '$ap_well_prepared',
      description: '$ap_well_prepared_desc',
      modifier: 'well_prepared',
      events: ['well_prepared_activation']
   },
   {
      ident: 'town_swot',
      name: '$ap_town_swot',
      description: '$ap_town_swot_desc',
      potential: [
         turnsLater(12),
         requireStartupNot({ author: 'cnpr', moduleName: 'core', id: 'detroit' }, 'detroit')
      ],
      modifier: 'town_swot'
   },
   {
      ident: 'king_of_involution',
      name: '$ap_king_of_involution',
      description: '$ap_king_of_involution_desc',
      potential: [requireAscensionPerk({ author: 'cnpr', moduleName: 'core', id: 'town_swot' }, 'town_swot')],
      modifier: 'king_of_involution',
      events: ['remove_town_swot_modifier']
   }
]

export default ascensionPerks

import { AscensionPerk } from '@app/ruleset'

const ascensionPerks: AscensionPerk[] = [
   {
      ident: 'well_prepared',
      name: '$ap_well_prepared',
      description: '$ap_well_prepared_desc',
      events: [
         'well_prepared_activation'
      ]
   }
]

export default ascensionPerks

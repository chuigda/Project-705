import { MapSite } from '@app/ruleset'

const mapSites: MapSite[] = [
   {
      ident: 'test_site',
      name: '$ms_test_site',
      description: '$ms_test_site_desc',

      branches: [{
         description: '$br_your_only_choice',
         selector: {
            type: 'random'
         }
      }],
      energyCost: 15
   }
]

export default mapSites

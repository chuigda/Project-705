import { Startup } from '@app/ruleset'

const startups: Startup[] = [
   {
      ident: 'normal',
      name: '$startup_normal',
      description: '$startup_normal_desc',

      events: ['common_setup', 'normal_init']
   },
   {
      ident: 'gifted',
      name: '$startup_gifted',
      description: '$startup_gifted_desc',

      events: ['common_setup', 'gifted_init']
   },
   {
      ident: 'poor',
      name: '$startup_poor',
      description: '$startup_poor_desc',
      events: ['poor_init']
   },
   {
      ident: 'detroit',
      name: '$startup_detroit',
      description: '$startup_detroit_desc',

      events: ['detroit_init']
   }
]

export default startups

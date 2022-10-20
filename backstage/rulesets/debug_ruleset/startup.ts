import { Startup } from '@app/ruleset'

const startups: Startup[] = [
   {
      ident: 'debug',
      name: '$startup_debug',
      description: '$startup_debug_desc',

      // TODO add this event
      events: ['debug_setup']
   }
]

export default startups

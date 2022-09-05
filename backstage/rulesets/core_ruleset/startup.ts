import { Startup } from '@app/ruleset'

const normalStartup: Startup = {
   ident: 'normal',
   name: '$startup_normal',
   description: '$startup_normal_desc'
}

const detroitStartup: Startup = {
   ident: 'detroit',
   name: '$startup_detroit',
   description: '$startup_detroit_desc',

   player: {
      attributes: {
         intelligence: 2000,
         emotionalIntelligence: 500,
         strength: 500,
         memorization: 99999,
         imagination: 500,
         charisma: 0
      }
   },
   events: []
}

export default [
   detroitStartup
]

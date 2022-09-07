import { Startup } from '@app/ruleset'

const normalStartup: Startup = {
   ident: 'normal',
   name: '$startup_normal',
   description: '$startup_normal_desc',

   player: {
      talent: {
         intelligence: 20,
         emotionalIntelligence: 20,
         strength: 20,
         memorization: 20,
         imagination: 20
      },
      moneyPerTurn: 30
   }
}

const giftedStartup: Startup = {
   ident: 'gifted',
   name: '$startup_gifted',
   description: '$startup_gifted_desc',

   player: {

   }
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
         imagination: 500
      }
   },
   events: ['detroit_init']
}


const startups: Startup[] = [
   normalStartup,
   detroitStartup
]

export default startups

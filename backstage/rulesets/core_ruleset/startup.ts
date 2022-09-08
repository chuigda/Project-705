import { Startup } from '@app/ruleset'

const startups: Startup[] = [
   {
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
      },
      events: ['common_setup']
   },
   {
      ident: 'gifted',
      name: '$startup_gifted',
      description: '$startup_gifted_desc',

      player: {
         talent: {
            intelligence: 50,
            emotionalIntelligence: 50,
            strength: 50,
            memorization: 50,
            imagination: 50
         },
         skillPoints: 500,
         moneyPerTurn: 40
      },
      events: ['common_setup', 'gifted_init']
   },
   {
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
   },
   {
      ident: 'beauty',
      name: '$startup_beauty',
      description: '$startup_beauty_desc',

      player: {
         attributes: {
            charisma: 500
         },
         talent: {
            charisma: 25
         }
      },
      events: ['beauty_init']
   }
]

export default startups

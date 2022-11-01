import { Activity } from '@app/ruleset'

const computerActivities: Activity[] = [
   {
      ident: 'guess_number',
      name: '$activity_guess_number',
      description: '$activity_guess_number_desc',
      category: '@computer',
      level: 1,

      energyCost: 25,
      output: {
         // TODO(chuigda): rewrite all these values
         /*
         mentalHealth: -5,
         satisfactory: 5,
         skillPoints: 15,
         attributes: {
            intelligence: 20,
            memorization: 10,
            imagination: 10
         }
         */
      }
   },
   {
      ident: 'backend_dev',
      name: '$activity_backend_dev',
      description: '$activity_backend_dev_desc',
      category: '@computer',
      level: 2,

      energyCost: 40,
      output: {
         // TODO(chuigda): rewrite all these values
         /*
         mentalHealth: -6,
         satisfactory: 8,
         skillPoints: 20,
         attributes: {
            intelligence: 30,
            imagination: 20
         },
         money: 20
         */
      }
   }
]

export default computerActivities

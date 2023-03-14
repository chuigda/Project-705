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
         '@mental_health': -5,
         '@satisfactory': 5,
         '@skill_point': 15,
         '@intelligence': 20,
         '@memorization': 10,
         '@imagination': 10
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
         '@mental_health': -6,
         '@satisfactory': 8,
         '@skill_point': 20,
         '@intelligence': 30,
         '@imagination': 20,
         '@money': 20
      }
   }
]

export default computerActivities

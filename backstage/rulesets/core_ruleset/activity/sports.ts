import { Activity } from '@app/ruleset'

const sportsActivities: Activity[] = [
   {
      ident: 'walk',
      name: '$activity_walk',
      description: '$activity_walk_desc',
      category: '@sports',
      level: 1,

      energyCost: 10,
      output: {
         // TODO(chuigda): rewrite all these values
         /*
         satisfactory: 5,
         skillPoints: 5,
         attributes: {
            strength: 6
         }
         */
      }
   }
]

export default sportsActivities

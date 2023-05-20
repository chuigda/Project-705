import { Activity } from '@app/core/ruleset'

const sportsActivities: Activity[] = [
   {
      ident: 'walk',
      name: '$activity_walk',
      description: '$activity_walk_desc',
      category: '@sports',
      level: 1,

      energyCost: 10,
      output: {
         '@satisfactory': 5,
         '@skill_point': 5,
         '@strength': 7
      }
   }
]

export default sportsActivities

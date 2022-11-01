import { Skill } from '@app/ruleset'

const commonSkills: Skill[] = [
   {
      ident: 'walk',
      name: '$skill_walk',
      description: '$skill_walk_desc',
      category: '@basic',

      cost: {
         base: 20
      },
      output: {
         '@strength': 50
      },
      activities: ['walk']
   },
   {
      ident: 'speak',
      name: '$skill_speak',
      description: '$skill_speak_desc',
      category: '@basic',

      cost: {
         base: 50,
         properties: {
            '@emotional_intelligence': 100
         }
      },
      output: {
         '@emotional_intelligence': 50
      },
      activities: ['speak']
   }
]

export default commonSkills

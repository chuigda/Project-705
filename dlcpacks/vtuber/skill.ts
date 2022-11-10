import { Skill } from './ruleset'

const skills: Skill[] = [
   {
      ident: 'vtuber0',
      name: '$skill_vtuber0',
      description: '$skill_vtuber0_desc',
      category: '@vtuber',
      cost: { base: 50 },
      output: {
         '@intelligence': 100,
         '@emotional_intelligence': 100,
         '@memorization': 100,
         '@charisma': 100
      }
   },
   {
      ident: 'vtuber_talk0',
      name: '$skill_vtuber_talk0',
      description: '$skill_vtuber_talk0_desc',
      category: '@vtuber',
      potential: ['vtuber0'],
      cost: {
         base: 200,
         properties: {
            '@emotional_intelligence': 2500,
            '@memorization': 1000,
            '@charisma': 500
         }
      },
      output: {
         '@emotional_intelligence': 500,
         '@memorization': 500,
         '@charisma': 200
      },
      activities: ['vtuber_talk0']
   },
   {
      ident: 'vtuber_gaming0',
      name: '$skill_vtuber_gaming0',
      description: '$skill_vtuber_gaming0_desc',
      category: '@vtuber',
      potential: ['vtuber0'],
      cost: {
         base: 200,
         properties: {
            '@emotional_intelligence': 1000,
            '@intelligence': 2000,
            '@strength': 1000
         }
      },
      output: {
         '@intelligence': 500,
         '@memorization': 500,
         '@charisma': 100
      },
      activities: ['@vtuber_gaming0']
   }
]

export default skills

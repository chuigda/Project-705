import { Activity } from './ruleset'

const activities: Activity[] = [
   {
      ident: 'vtuber_talk0',
      name: '$activity_vtuber_talk0',
      description: '$activity_vtuber_talk0_desc',
      category: '@vtuber',
      level: 0,
      energyCost: 40,
      output: {
         '@emotional_intelligence': 50,
         '@memorization': 15,
         '@charisma': 20,
         '@money': 10
      }
   },
   {
      ident: 'vtuber_gaming0',
      name: '$activity_vtuber_gaming0',
      description: '$activity_vtuber_gaming0_desc',
      category: '@vtuber',
      level: 0,
      energyCost: 40,
      output: {
         '@intelligence': 50,
         '@memorization': 30,
         '@charisma': 10,
         '@money': 5
      }
   }
]

export default activities

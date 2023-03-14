import { Activity } from '@app/ruleset'

const chineseActivities: Activity[] = [
   {
      ident: 'speak',
      name: '$activity_speak',
      description: '$activity_speak_desc',
      category: '@chinese',
      level: 1,

      energyCost: 10,
      output: {
         '@emotional_intelligence': 5,
         '@skill_point': 5
      }
   },
   {
      ident: 'pinyin',
      name: '$activity_pinyin',
      description: '$activity_pinyin_desc',
      category: '@chinese',
      level: 2,

      energyCost: 10,
      output: {
         '@emotional_intelligence': 8,
         '@memorization': 8,
         '@skill_point': 5
      }
   },
   {
      ident: 'readwrite_cn',
      name: '$activity_readwrite_cn',
      description: '$activity_readwrite_cn_desc',
      category: '@chinese',
      level: 3,

      energyCost: 15,
      output: {
         '@emotional_intelligence': 25,
         '@skill_point': 10,
         '@mental_health': -3,
      }
   },
   {
      ident: 'poetry_cn',
      name: '$activity_poetry_cn',
      description: '$activity_poetry_cn_desc',
      category: '@chinese',
      level: 3,

      energyCost: 15,
      output: {
         '@memorization': 20,
         '@skill_point': 15,
         '@mental_health': -5
      }
   },
   {
      ident: 'essay_cn',
      name: '$activity_essay_cn',
      description: '$activity_essay_cn_desc',
      category: '@chinese',
      level: 4,

      energyCost: 20,
      output: {
         '@emotional_intelligence': 40,
         '@skill_point': 20,
         '@mental_health': -5
      }
   },
   {
      ident: 'novel_writing',
      name: '$activity_novel_writing',
      description: '$activity_novel_writing_desc',
      category: '@chinese',
      level: 5,

      energyCost: 20,
      output: {
         '@emotional_intelligence': 50,
         '@imagination': 20,
         '@charisma': 10,
         '@skill_point': 25,
         '@money': 3,
         '@mental_health': -5
      },

      events: ['novel_writing_progress']
   }
]

export default chineseActivities

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
         attributes: {
            emotionalIntelligence: 5
         },
         skillPoints: 5
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
         attributes: {
            emotionalIntelligence: 8,
            memorization: 8
         },
         skillPoints: 5
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
         attributes: {
            emotionalIntelligence: 25,
         },
         skillPoints: 10,
         mentalHealth: -3
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
         attributes: {
            memorization: 20,
         },
         skillPoints: 15,
         mentalHealth: -5
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
         attributes: {
            emotionalIntelligence: 40
         },
         skillPoints: 20,
         mentalHealth: -5
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
         attributes: {
            emotionalIntelligence: 50,
            imagination: 20,
            charisma: 10
         },
         skillPoints: 25,
         money: 3,
         mentalHealth: -5
      }
   }
]

export default chineseActivities

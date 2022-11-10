import { RuleSet } from './ruleset'
import skills from './skill'
import activities from './activity'
import translations from './translation'

const ruleSet: RuleSet = {
   descriptor: {
      ident: {
         author: 'cnpr',
         moduleName: 'vtb',
      },
      skillCategories: [
         {
            ident: '@vtuber',
            name: '$skill_category_vtuber',
            description: '$skill_category_vtuber_desc'
         }
      ],
      activityCategories: ['@vtuber']
   },
   content: {
      name: '$ruleset_name',
      description: '$ruleset_desc',
      skills,
      activities,
      translations,

      onRuleSetLoaded: ['vtb_dlc_init']
   }
}

export default ruleSet

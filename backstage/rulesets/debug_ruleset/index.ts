import { RuleSet } from '@app/ruleset'
import skillCategories from './skill_categories'
import activityCategories from './activity_categories'
import skills from './skills'
import translations from './translation'

const ruleSet: RuleSet = {
   ident: {
      author: 'cnpr',
      moduleName: 'dbg'
   },
   skillCategories,
   activityCategories,
   skills,
   translations
}

export default ruleSet

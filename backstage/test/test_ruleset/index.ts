import { Scope } from '@app/base/uid'
import skillCategories from './skill_categories'
import activityCategories from './activity_categories'
import skills from './skills'
import translations from './translation'

const ruleSet = {
   ident: new Scope('test', 'test'),
   skillCategories,
   activityCategories,
   skills,
   translations
}

export default ruleSet

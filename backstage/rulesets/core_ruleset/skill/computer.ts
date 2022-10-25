import { Skill } from '@app/ruleset'
import { requireStartupNot } from '@rulesets/core_ruleset/common_potential'

const computerSkills: Skill[] = [
   {
      ident: 'rust_lang',
      name: '$skill_rust_lang',
      description: '$skill_rust_lang_desc',
      category: '@computer',

      potential: [
         'math_function',
         'english_writing',
         requireStartupNot({ author: 'cnpr', moduleName: 'core', id: 'poor' })
      ],
      cost: {
         base: 400,
         properties: {
            '@intelligence': 2500,
            '@memorization': 1000,
            '@imagination': 1000
         }
      },
      output: {
         '@intelligence': 200,
         '@memorization': 100,
         '@imagination': 100
      },
      activities: ['guess_number']
   }
]

export default computerSkills

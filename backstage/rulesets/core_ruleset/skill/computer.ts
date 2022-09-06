import { PotentialExpressionFunctionOp } from '@app/ruleset/items/potential'
import { GameContext } from '@app/executor/game_context'
import { mStartupId } from '@app/base/uid'
import { Skill } from '@app/ruleset'

const notPoorStartup: PotentialExpressionFunctionOp = {
   op: (cx: GameContext) => cx.state.startup !== mStartupId({ author: 'cnpr', moduleName: 'core' }, 'poor'),
   description: '$potential_no_poor_startup'
}

const computerSkills: Skill[] = [
   {
      ident: 'rust_lang',
      name: '$skill_rust_lang',
      description: '$skill_rust_lang_desc',
      category: '@computer',

      potential: [
         'math_function',
         'english_writing',
         notPoorStartup
      ],
      cost: {
         base: 400,
         attributes: {
            intelligence: 2500,
            memorization: 1000,
            imagination: 1000
         }
      },
      output: {
         attributes: {
            intelligence: 200,
            memorization: 100,
            imagination: 100
         }
      },
      activities: ['guess_number']
   },
   {
      ident: 'http_basis',
      name: '$skill_http_basis',
      description: '$skill_http_basis_desc',
      category: '@computer',

      potential: ['rust_lang'],
      cost: {
         base: 400,
         attributes: {
            intelligence: 3500
         }
      },
      output: {
         attributes: {
            intelligence: 200
         }
      },
      activities: ['backend_dev']
   }
]

export default computerSkills

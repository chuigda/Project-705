import { Skill } from '../../ruleset'

const skills: Skill[] = [
   {
      ident: 'skill1',
      name: '$skill1_name',
      description: '$skill1_desc',
      cost: {
         base: 50
      },
      category: 'category1',
      output: {
         attributes: {

         }
      },
      activities: ['activity1']
   },
]

export default skills

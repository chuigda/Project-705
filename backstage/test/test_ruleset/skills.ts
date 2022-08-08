import { Skill, SkillCost, SkillOutput } from '@app/ruleset/items/skill'
import { GameContext, PlayerAttributes } from '@appexecutor/game_context'
import { PotentialExpressionFunctionOp } from '@appruleset/items/potential'

const skills: Skill[] = [
   new Skill(
      'skill1',
      '$skill1_name',
      '$skill1_desc',
      new SkillCost(50),
      {
         category: 'category1',
         output: new SkillOutput(new PlayerAttributes({
            intelligence: 50
         })),
         activities: ['activity1']
      }
   ),
   new Skill(
      'skill2',
      '$skill2_name',
      '$skill2_desc',
      new SkillCost(100, new PlayerAttributes({ intelligence: 100 })),
      {
         category: 'category2',
         output: new SkillOutput(new PlayerAttributes({
            strength: 50
         })),
         activities: ['activity2']
      }
   ),
   new Skill(
      'skill3',
      '$skill3_name',
      '$skill3_desc',
      new SkillCost(100, new PlayerAttributes({ intelligence: 150, strength: 150 })),
      {
         category: 'category2',
         potential: ['skill1', 'skill2'],
         events: ['event1']
      }
   ),
   new Skill(
      'skill4',
      '$skill4_name',
      '$skill4_desc',
      new SkillCost(0),
      {
         category: 'category1',
         potential: [
            new PotentialExpressionFunctionOp(
               (gameContext: GameContext): boolean => {
                  return gameContext.turns >= 5
               },
               '$skill4_potential'
            )
         ],
         events: ['event2']
      }
   )
]

export default skills

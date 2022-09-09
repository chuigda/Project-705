import { Modifier } from '@app/ruleset'

const ascensionPerkModifiers: Modifier[] = [
   {
      ident: 'town_swot',
      name: '$md_town_swot',
      description: '$md_town_swot_desc',

      player: {
         mentalHealth: {
            '@activity:@chinese': { loss: -0.25 },
            '@activity:@math': { loss: -0.25 },
            '@activity:@english': { loss: -0.25 },
            '@activity:@liberal': { loss: -0.25 },
            '@activity:@science': { loss: -0.25 }
         }
      },
      skillPointCost: {
         '@chinese': -0.2,
         '@math': -0.2,
         '@english': -0.2,
         '@liberal': -0.2,
         '@science': -0.2
      }
   },
   {
      ident: 'king_of_involution',
      name: '$md_king_of_involution',
      description: '$md_king_of_involution_desc',

      player: {
         attributes: {
            charisma: {
               'all': { gain: -0.3, loss: 0.3 }
            }
         },
         skillPoints: {
            '@activity:@chinese': { gain: 0.3 },
            '@activity:@math': { gain: 0.3 },
            '@activity:@english': { gain: 0.3 },
            '@activity:@liberal': { gain: 0.3 },
            '@activity:@science': { gain: 0.3 }
         },
         mentalHealth: {
            '@activity:@chinese': { loss: -0.6 },
            '@activity:@math': { loss: -0.6 },
            '@activity:@english': { loss: -0.6 },
            '@activity:@liberal': { loss: -0.6 },
            '@activity:@science': { loss: -0.6 }
         }
      },
      skillPointCost: compilation => {
         const r: Record<string, number> = {
            '@chinese': -0.5,
            '@math': -0.5,
            '@english': -0.5,
            '@liberal': -0.5,
            '@science': -0.5,
         }

         for (const skillCategory of compilation.skillCategories) {
            const skillCategoryId = skillCategory.ident
            if (['@chinese', '@math', '@english', '@liberal', '@science'].indexOf(skillCategoryId) === -1) {
               r[skillCategoryId] = 0.2
            }
         }
         return r
      }
   }
]

export default ascensionPerkModifiers
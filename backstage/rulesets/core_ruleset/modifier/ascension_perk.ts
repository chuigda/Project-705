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
         skillPoints: {
            '@activity:@chinese': { gain: 0.3 },
            '@activity:@math': { gain: 0.3 },
            '@activity:@english': { gain: 0.3 },
            '@activity:@liberal': { gain: 0.3 },
            '@activity:@science': { gain: 0.3 },
         },
         mentalHealth: {
            '@activity:@chinese': { loss: -0.6 },
            '@activity:@math': { loss: -0.6 },
            '@activity:@english': { loss: -0.6 },
            '@activity:@liberal': { loss: -0.6 },
            '@activity:@science': { loss: -0.6 }
         }
      },
      skillPointCost: {
         '@chinese': -0.6,
         '@math': -0.6,
         '@english': -0.6,
         '@liberal': -0.6,
         '@science': -0.6
      }
   }
]

export default ascensionPerkModifiers

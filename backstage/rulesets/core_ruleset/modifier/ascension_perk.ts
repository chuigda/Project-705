import { Modifier } from '@app/ruleset'
import { majorSubjects } from '@rulesets/core_ruleset/definition'

const ascensionPerkModifiers: Modifier[] = [
   {
      ident: 'well_prepared',
      name: '$md_well_prepared',
      description: '$md_well_prepared_desc',
      skillPointCost: {
         '@basic': -0.5
      }
   },
   {
      ident: 'dont_be_busy',
      name: '$md_dont_be_busy',
      description: '$md_dont_be_busy_desc',
      player: {
         attributes: {
            strength: { '@activity:all': { gain: -0.1 } },
            intelligence: { '@activity:all': { gain: -0.1 } },
            emotionalIntelligence: { '@activity:all': { gain: -0.1 } },
            memorization: { '@activity:all': { gain: -0.1 } },
            imagination: { '@activity:all': { gain: -0.1 } }
         }
      }
   },
   {
      ident: 'dont_be_busy_boost',
      name: '$md_dont_be_busy_boost',
      description: '$md_dont_be_busy_boot_desc',
      player: {
         attributes: {
            strength: { '@activity:all': { gain: 0.15 } },
            intelligence: { '@activity:all': { gain: 0.15 } },
            emotionalIntelligence: { '@activity:all': { gain: 0.15 } },
            memorization: { '@activity:all': { gain: 0.15 } },
            imagination: { '@activity:all': { gain: 0.15 } }
         },
         skillPoints: {
            'all': { gain: 0.1 }
         }
      }
   },
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
         const r: Record<string, number> = Object.fromEntries(majorSubjects.map(subject => [subject, -0.5]))
         for (const skillCategory of compilation.skillCategories) {
            const skillCategoryId = skillCategory.ident
            if (majorSubjects.indexOf(skillCategoryId) === -1) {
               r[skillCategoryId] = 0.2
            }
         }
         return r
      }
   }
]

export default ascensionPerkModifiers

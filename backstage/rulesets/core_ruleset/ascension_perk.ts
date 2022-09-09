import { AscensionPerk } from '@app/ruleset'
import {
   requireAscensionPerk,
   requireNoAscensionPerk,
   requireStartup,
   requireStartupNot,
   afterTurns
} from '@rulesets/core_ruleset/common_potential'

const ascensionPerks: AscensionPerk[] = [
   /// -*- ------------ 初始飞升 ------------ -*-

   // 未雨绸缪
   {
      ident: 'well_prepared',
      name: '$ap_well_prepared',
      description: '$ap_well_prepared_desc',
      modifier: 'well_prepared',
      events: ['well_prepared_activation']
   },

   // 厚积薄发
   {
      ident: 'dont_be_busy',
      name: '$ap_dont_be_busy',
      description: '$ap_dont_be_busy_desc',
      modifier: 'dont_be_busy',
      events: ['dont_be_busy_desc']
   },

   /// -*- ------------ 一阶飞升 ------------ -*-

   // 小镇做题家
   {
      ident: 'town_swot',
      name: '$ap_town_swot',
      description: '$ap_town_swot_desc',
      potential: [
         afterTurns(12),
         requireStartupNot(
            { author: 'cnpr', moduleName: 'core', id: 'detroit' },
            'detroit'
         )
      ],
      modifier: 'town_swot'
   },
   // 情感模拟器
   {
      ident: 'emotion_emulation',
      name: '$ap_emotion_emulation',
      description: '$ap_emotion_emulation',
      potential: [
         afterTurns(12),
         requireStartup({ author: 'cnpr', moduleName: 'core', id: 'detroit' }, 'detroit'),
         requireNoAscensionPerk(
            { author: 'cnpr', moduleName: 'core', id: 'synthetic_evolution' },
            'synthetic_evolution'
         ),
         {
            op: gameContext => gameContext.getV('software_unstable') >= 500,
            description: '$potential_detroit_software_unstable_500'
         }
      ],
      events: ['emotion_emulation_activation']
   },

   /// -*- ------------ 二阶飞升 ------------ -*-

   // 卷王
   {
      ident: 'king_of_involution',
      name: '$ap_king_of_involution',
      description: '$ap_king_of_involution_desc',
      potential: [
         requireAscensionPerk(
            { author: 'cnpr', moduleName: 'core', id: 'town_swot' },
            'town_swot'
         )
      ],
      modifier: 'king_of_involution',
      events: ['king_of_evolution_activation']
   },
   // 人造情感
   {
      ident: 'artificial_emotion',
      name: '$ap_artificial_emotion',
      description: '$ap_artificial_emotion',
      potential: [
         requireAscensionPerk(
            { author: 'cnpr', moduleName: 'core', id: 'emotion_emulation' },
            'emotion_emulation'
         ),
         {
            op: gameContext => gameContext.getV('software_unstable') >= 1000,
            description: '$potential_detroit_software_unstable_1000'
         }
      ],
      events: ['artificial_emotion_activation']
   }
]

export default ascensionPerks

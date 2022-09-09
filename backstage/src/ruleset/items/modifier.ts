import { ItemBase } from '@app/ruleset/items/item_base'
import { SkillCategoryId } from '@app/ruleset'
import ruleset from '@app/server/ruleset'
import { CompiledRuleSet } from '@app/loader'

export type ValueSource =
   '@talent'
   | '@learn_skill'
   | '@turn'
   | '@incident'
   | '@exam'
   | '@essay_competition'
   | '@election'
   | '@variety_show'
   | string

export interface ModifierValue {
   gain?: number
   loss?: number
}

export type PropertyModifier = Record<ValueSource, ModifierValue>

export interface AttributeModifiers {
   strength?: PropertyModifier
   intelligence?: PropertyModifier
   emotionalIntelligence?: PropertyModifier
   memorization?: PropertyModifier
   imagination?: PropertyModifier
   charisma?: PropertyModifier
}

export interface PlayerModifier {
   attributes?: AttributeModifiers
   talent?: AttributeModifiers

   skillPoints?: PropertyModifier
   energy?: PropertyModifier
   mentalHealth?: PropertyModifier
   satisfactory?: PropertyModifier
   money?: PropertyModifier
   moneyPerTurn?: PropertyModifier
}

export type PlayerModifierGen = (compilation: CompiledRuleSet) => PlayerModifier

export type SkillPointCostModifier = Record<'all' | SkillCategoryId, number>

export type SkillPointCostModifierGen = (compilation: CompiledRuleSet) => SkillPointCostModifier

export interface Modifier extends ItemBase {
   icon?: string // TODO(chuigda): gfx features

   player?: PlayerModifier | PlayerModifierGen
   skillPointCost?: SkillPointCostModifier | SkillPointCostModifierGen
}

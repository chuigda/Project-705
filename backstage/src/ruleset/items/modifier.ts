import { ItemBase } from '@app/ruleset/items/item_base'
import { SkillCategoryId } from '@app/ruleset'
import { PropertyId } from '@app/executor/game_context/player'

export type ValueSource =
   '@talent'
   | '@learn_skill'
   | '@activity'
   | '@turn'
   | '@incident'
   | '@exam'
   | '@essay_competition'
   | '@election'
   | '@variety_show'
   | '@explore'
   | '@purchase'
   | string

export interface ModifierValue {
   gain?: number
   loss?: number
}

export type PropertyModifier = Record<ValueSource, ModifierValue>

export type PlayerModifier = Record<PropertyId, PropertyModifier>

export type SkillPointCostModifier = Record<'all' | SkillCategoryId, number>

export interface Modifier extends ItemBase {
   icon?: string // TODO(chuigda): gfx features

   player?: PlayerModifier
   skillPointCost?: SkillPointCostModifier
}

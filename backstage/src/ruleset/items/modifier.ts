import { ItemBase } from '@app/ruleset/items/item_base'

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
   | string

export interface ModifierValue {
   gain?: number
   loss?: number
}

export interface AttributesModifier {
   strength: Record<ValueSource, ModifierValue>
   intelligence: Record<ValueSource, ModifierValue>
   emotionalIntelligence: Record<ValueSource, ModifierValue>
   memorization: Record<ValueSource, ModifierValue>
   imagination: Record<ValueSource, ModifierValue>
   charisma: Record<ValueSource, ModifierValue>
}

export interface PlayerModifier {
   attributes: AttributesModifier
   talent: AttributesModifier

   skillPoints: Record<ValueSource, ModifierValue>
   energy: Record<ValueSource, ModifierValue>
   mentalHealth: Record<ValueSource, ModifierValue>
   satisfactory: Record<ValueSource, ModifierValue>
   money: Record<ValueSource, ModifierValue>
   moneyPerTurn: Record<ValueSource, ModifierValue>
}

export type SkillPointCostModifier = Record</* skill category id */ string, number>

export interface Modifier extends ItemBase {
   displayIcon?: string // TODO(chuigda): gfx features

   player?: PlayerModifier
   skillPointCost?: SkillPointCostModifier
}

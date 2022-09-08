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

export interface AttributesModifier {
   strength: Record<ValueSource, number>
   intelligence: Record<ValueSource, number>
   emotionalIntelligence: Record<ValueSource, number>
   memorization: Record<ValueSource, number>
   imagination: Record<ValueSource, number>
   charisma: Record<ValueSource, number>
}

export interface PlayerModifier {
   attributes: AttributesModifier
   talent: AttributesModifier

   skillPoints: Record<ValueSource, number>
   energy: Record<ValueSource, number>
   mentalHealth: Record<ValueSource, number>
   satisfactory: Record<ValueSource, number>
   money: Record<ValueSource, number>
   moneyPerTurn: Record<ValueSource, number>
}

export type SkillPointCostModifier = Record</* skill category id */ string, number>

export interface Modifier extends ItemBase {
   displayIcon?: string // TODO(chuigda): gfx features

   player?: PlayerModifier
   skillPointCost?: SkillPointCostModifier
}

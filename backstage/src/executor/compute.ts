import { LogicOp } from '@app/ruleset/ops'
import { GameContext, PlayerAttributes } from '@app/executor/game_context'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '@app/ruleset/items/potential'
import { MaybeTranslationKey } from '@app/base/uid'
import { Skill, SkillCost, SkillPotential } from '@app/ruleset/items/skill'
import { AscensionPerk } from '@app/ruleset/items/ascension_perk'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import {
   AttributeModifiers,
   Modifier,
   ModifierValue,
   PlayerModifier,
   PropertyModifier,
   SkillPointCostModifier,
   ValueSource
} from '@app/ruleset/items/modifier'
import { SkillCategoryId } from '@app/ruleset'
import { popScope, pushScope } from '@app/executor/events'
import { MaybeTranslatable } from '@app/base/translation'

export interface PotentialResultBase {
   readonly result: boolean
   readonly neverAgain: boolean
}

export interface PotentialFunctionResult extends PotentialResultBase {
   readonly description: MaybeTranslatable
}

export interface PotentialLogicOpResult extends PotentialResultBase {
   readonly op: LogicOp
   readonly resultPieces: PotentialResult[]
}

export function computePotential(gameContext: GameContext, potential: PotentialExpression): PotentialResult {
   if (typeof potential.op === 'function') {
      potential = <PotentialExpressionFunctionOp>potential
      let result
      try {
         result = potential.op(gameContext)
      } catch (e) {
         console.error(`[E] [computePotential] error when computing potential expression: ${e}\n${e.stack}`)
         result = false
      }
      return {
         result,
         neverAgain: result ? false : (!!potential.onceFalse),
         description: potential.description,
      }
   } else {
      potential = <PotentialExpressionLogicOp>potential
      const resultPieces = potential.arguments.map(arg => computePotential(gameContext, arg))
      let result
      switch (potential.op) {
         case 'and':
            result = resultPieces.every(piece => piece.result)
            break
         case 'or':
            result = resultPieces.some(piece => piece.result)
            break
         case 'not':
            result = !resultPieces.every(piece => piece.result)
            break
      }
      return {
         result,
         neverAgain: resultPieces.some(piece => piece.neverAgain),
         op: potential.op,
         resultPieces
      }
   }
}

export type PotentialResult = PotentialFunctionResult | PotentialLogicOpResult

export interface HasSkillOrNot extends PotentialResultBase {
   readonly skillId: string
   readonly skillName: MaybeTranslationKey
}

export type SkillPotentialResult = PotentialResult | HasSkillOrNot

export function isPotentialFunctionResult(spr: SkillPotentialResult): boolean {
   return 'description' in spr
}

export function isPotentialLogicOpResult(spr: SkillPotentialResult): boolean {
   return 'op' in spr
}

export function isHasSkillOrNot(spr: SkillPotentialResult): boolean {
   return 'skillId' in spr
}

export function computeSkillPotential(gameContext: GameContext, skillPotential: SkillPotential): SkillPotentialResult {
   if (/* PotentialExpression */ typeof skillPotential === 'object' && 'op' in skillPotential) {
      return computePotential(gameContext, skillPotential)
   } /* Ident */ else {
      const skillId = <string>skillPotential
      const skill = gameContext.ruleSet.skills[skillId]
      if (!skill) {
         console.error(`[E] [computeSkillPotential] skill '${skillPotential}' does not exist`)
         return {
            result: false,
            neverAgain: false,
            skillId: '@unknown_skill',
            skillName: '@unknown_skill_name'
         }
      }

      return {
         result: !!gameContext.state.player.skills[skillId],
         neverAgain: false,
         skillId,
         skillName: skill.name
      }
   }
}

export function computeSkillCost(
   gameContext: GameContext,
   skillCost: SkillCost,
   skillCategory?: SkillCategoryId
): number {
   const costModifiers = gameContext.state.computedModifier!.skillPointCost
   let modifier = 1

   if ('all' in costModifiers) {
      modifier += costModifiers.all.computedValue
   }

   if (skillCategory && skillCategory in costModifiers) {
      modifier += costModifiers[skillCategory].computedValue
   }

   if (modifier < 0) {
      modifier = 0
   }

   if (!skillCost || !skillCost.base) {
      return 0
   }

   const { base, attributes } = skillCost
   console.debug(`[D] [computeSkillCost] base cost = ${base}, attributes = ${attributes}`)
   let totalDiffRatio = 0.0
   if (attributes) {
      for (const attrName in attributes) {
         const attribute = gameContext.state.player.attributes[<keyof PlayerAttributes>attrName]
         const requiredAttribute = attributes[<keyof PlayerAttributesUpdate>attrName]

         if (requiredAttribute) {
            const diff = attribute - requiredAttribute
            console.debug(
               `[D] [computeSkillCost] gameContext.player.attributes[${attrName}] = ${attribute}` +
               `, attributes[${attrName}] = ${requiredAttribute}` +
               `, diff = ${diff}`
            )
            if (diff < 0) {
               totalDiffRatio += -(diff / requiredAttribute)
               console.debug(`[D] [computeSkillCost] diff contribution = ${-(diff / requiredAttribute)}`)
            }
         }
      }
   }
   totalDiffRatio *= 3.0
   if (totalDiffRatio > 10.0) {
      totalDiffRatio = 10.0
   }

   let cost = Math.ceil(base * (1.0 + totalDiffRatio) * modifier)
   if (cost > 999) {
      cost = 999
   }
   return Math.floor(cost)
}

export class AvailableSkill {
   readonly skill: Skill
   readonly cost: number
}

export class UnavailableSkill {
   readonly skill: Skill
   readonly resultPieces: SkillPotentialResult[]
}

export class ComputedSkills {
   available: Record<string, AvailableSkill>
   unavailable: Record<string, UnavailableSkill>
}

export function computePotentialSkills(gameContext: GameContext) {
   const available: Record<string, AvailableSkill> = {}
   const unavailable: Record<string, UnavailableSkill> = {}

   const { skillPool } = gameContext
   for (const skill of Object.values(skillPool)) {
      const { ident, potential } = skill
      const identStr = <string>ident

      let result = true
      let neverAgain = false
      const resultPieces: SkillPotentialResult[] = []
      if (potential) {
         pushScope(gameContext, skill.scope!)
         for (const potentialPart of potential) {
            resultPieces.push(computeSkillPotential(gameContext, potentialPart))
         }
         result = resultPieces.every(piece => piece.result)
         neverAgain = resultPieces.some(piece => piece.neverAgain)
         popScope(gameContext)
      }

      if (result) {
         const cost = computeSkillCost(gameContext, skill.cost, skill.category)
         console.debug(`[D] [computePotentialSkills] skill '${ident}' available, it costs: ${cost}`)
         available[identStr] = { skill, cost }
      } else {
         console.debug(`[D] [computePotentialSkills] skill '${ident}' not available`)
         if (neverAgain) {
            delete gameContext.skillPool[identStr]
         } else {
            unavailable[identStr] = {
               skill,
               resultPieces
            }
         }
      }
   }

   gameContext.state.computedSkills = {
      available,
      unavailable
   }
   gameContext.updateTracker.computedSkills = true
}

export function recomputeSkillCosts(gameContext: GameContext) {
   const available: Record<string, AvailableSkill> = {}
   for (const { skill } of Object.values(gameContext.state.computedSkills!.available)) {
      const { ident, cost } = skill
      const newCost = computeSkillCost(gameContext, cost, skill.category)
      console.debug(`[D] [recomputeSkillCosts] skill '${ident}' costs ${newCost}`)

      available[<string>ident] = { skill, cost: newCost }
   }
   gameContext.state.computedSkills!.available = available
   gameContext.updateTracker.computedSkills = true
}

export class UnavailableAscensionPerk {
   readonly ascensionPerk: AscensionPerk
   readonly resultPieces: PotentialResult[]
}

export class ComputedAscensionPerks {
   readonly available: Record<string, AscensionPerk>
   readonly unavailable: Record<string, UnavailableAscensionPerk>
}

export function computePotentialAscensionPerks(gameContext: GameContext) {
   const available: Record<string, AscensionPerk> = {}
   const unavailable: Record<string, UnavailableAscensionPerk> = {}

   const { ascensionPerkPool } = gameContext

   for (const ascensionPerk of Object.values(ascensionPerkPool)) {
      const { ident, potential } = ascensionPerk
      const identStr = <string>ident

      let result = true
      let neverAgain = false
      let resultPieces: PotentialResult[] = []
      if (potential) {
         pushScope(gameContext, ascensionPerk.scope!)
         resultPieces = potential.map(potentialPart => computePotential(gameContext, potentialPart))
         result = resultPieces.every(piece => piece.result)
         neverAgain = resultPieces.some(piece => piece.neverAgain)
         popScope(gameContext)
      }

      console.debug(`[D] [computePotentialAscensionPerks] computed ascension perk '${ident}': ${result}`)
      if (result) {
         console.debug(`[D] [computePotentialAscensionPerks] ascension perk '${ident}' available`)
         available[identStr] = ascensionPerk
      } else {
         console.debug(`[D] [computePotentialAscensionPerks] ascension perk '${ident}' not available`)
         if (neverAgain) {
            delete gameContext.ascensionPerkPool[identStr]
         } else {
            unavailable[identStr] = {
               ascensionPerk,
               resultPieces
            }
         }
      }
   }

   gameContext.state.computedAscensionPerks = { available, unavailable }
   gameContext.updateTracker.computedAscensionPerks = true
}

export interface IContribution {
   name: MaybeTranslationKey
   value: number
   icon?: string
}

export class ComputedPropertyModifier {
   gain: number = 0.0
   gainContributions: IContribution[] = []

   loss: number = 0.0
   lossContributions: IContribution[] = []

   addContribution(name: MaybeTranslationKey, value: ModifierValue, icon?: string) {
      if (value.gain) {
         this.gain += value.gain
         this.gainContributions.push({
            name,
            value: value.gain,
            icon
         })
      }
      if (value.loss) {
         this.loss += value.loss
         this.lossContributions.push({
            name,
            value: value.loss,
            icon
         })
      }
   }
}

export class ComputedAttributeModifiers {
   strength: ComputedPropertyModifier = new ComputedPropertyModifier()
   intelligence: ComputedPropertyModifier = new ComputedPropertyModifier()
   emotionalIntelligence: ComputedPropertyModifier = new ComputedPropertyModifier()
   memorization: ComputedPropertyModifier = new ComputedPropertyModifier()
   imagination: ComputedPropertyModifier = new ComputedPropertyModifier()
   charisma: ComputedPropertyModifier = new ComputedPropertyModifier()
}

export class ComputedPlayerModifier {
   attributes: ComputedAttributeModifiers = new ComputedAttributeModifiers()
   talent: ComputedAttributeModifiers = new ComputedAttributeModifiers()

   skillPoints: ComputedPropertyModifier = new ComputedPropertyModifier()
   energy: ComputedPropertyModifier = new ComputedPropertyModifier()
   mentalHealth: ComputedPropertyModifier = new ComputedPropertyModifier()
   satisfactory: ComputedPropertyModifier = new ComputedPropertyModifier()
   money: ComputedPropertyModifier = new ComputedPropertyModifier()
   moneyPerTurn: ComputedPropertyModifier = new ComputedPropertyModifier()

   getModifier(propertyPath: string): ComputedPropertyModifier | undefined {
      const pathParts: string[] = propertyPath.split('.')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that: ComputedPlayerModifier | ComputedAttributeModifiers | ComputedPropertyModifier = this
      for (const pathPart of pathParts) {
         if (that instanceof ComputedPropertyModifier) {
            console.warn(`[W] [getModifier] invalid property path: '${propertyPath}'`)
            return undefined
         }

         // @ts-ignore
         const part: ComputedAttributeModifiers | ComputedPropertyModifier | undefined = that[pathPart]
         if (!part) {
            console.warn(`[W] [getModifier] invalid property path: '${propertyPath}'`)
            return undefined
         }

         that = part
      }

      if (!(that instanceof ComputedPropertyModifier)) {
         console.warn(`[W] [getModifier] invalid property path: '${propertyPath}'`)
         return undefined
      }

      return that
   }
}

export class ComputedSkillPointCostModifier {
   computedValue: number = 0.0
   contributions: IContribution[] = []

   addContribution(name: MaybeTranslationKey, value: number, icon?: string) {
      this.computedValue += value
      this.contributions.push({ name, value, icon })
   }
}

export class ComputedModifier {
   player: Record<ValueSource, ComputedPlayerModifier> = {}
   skillPointCost: Record<'all' | SkillCategoryId, ComputedSkillPointCostModifier> = {}
}

function computeAttributeModifiers(
   computed: ComputedModifier,
   property: 'attributes' | 'talent',
   input: AttributeModifiers,
   name: MaybeTranslationKey,
   icon: string | undefined
) {
   // TODO: poor hard-coded bullshit, would break if we add more properties. needs improvement.
   for (const attrName in [
      'strength',
      'intelligence',
      'emotionalIntelligence',
      'memorization',
      'imagination',
      'charisma'
   ]) {
      const attrModifiers = input[<keyof AttributeModifiers>attrName]
      if (!attrModifiers) {
         continue
      }

      for (const valueSource in attrModifiers) {
         if (!computed.player[valueSource]) {
            computed.player[valueSource] = new ComputedPlayerModifier()
         }

         const value = (<PropertyModifier>attrModifiers)[valueSource]
         const dest =
            <ComputedPropertyModifier>computed.player[valueSource][property][<keyof ComputedAttributeModifiers>attrName]
         dest.addContribution(name, value, icon)
      }
   }
}

export function computeModifier(gameContext: GameContext) {
   gameContext.state.computedModifier = new ComputedModifier()
   const computed = gameContext.state.computedModifier

   for (const modifierId of gameContext.state.modifiers) {
      const modifier: Modifier = gameContext.ruleSet.modifiers[modifierId]
      if (!modifier) {
         console.error(`[E] [computeModifier] modifier '${modifierId}' does not exist`)
         continue
      }

      const { name, icon, player, skillPointCost } = modifier

      if (player) {
         const { attributes, talent } = <PlayerModifier>player

         if (attributes) {
            computeAttributeModifiers(computed, 'attributes', attributes, name, icon)
         }

         if (talent) {
            computeAttributeModifiers(computed, 'talent', talent, name, icon)
         }

         // TODO: poor hard-coded bullshit, would break if we add more properties. needs improvement.
         for (const field of [
            'skillPoints',
            'energy',
            'mentalHealth',
            'satisfactory',
            'money',
            'moneyPerTurn'
         ]) {
            const propertyModifier = <PropertyModifier | undefined>(
               (<PlayerModifier>player)[<keyof PlayerModifier>field]
            )
            if (!propertyModifier) {
               continue
            }

            for (const valueSource in propertyModifier) {
               if (!computed.player[valueSource]) {
                  computed.player[valueSource] = new ComputedPlayerModifier()
               }

               const value = propertyModifier[valueSource]
               const dest =
                  <ComputedPropertyModifier>computed.player[valueSource][<keyof ComputedPlayerModifier>field]
               dest.addContribution(name, value, icon)
            }
         }
      }

      if (skillPointCost) {
         for (const skillCategory in skillPointCost) {
            if (!computed.skillPointCost[skillCategory]) {
               computed.skillPointCost[skillCategory] = new ComputedSkillPointCostModifier()
            }
            computed.skillPointCost[skillCategory].addContribution(
               name,
               (<SkillPointCostModifier>skillPointCost)[skillCategory],
               icon
            )
         }
      }
   }
}

export default {
   computePotential,
   computeSkillPotential,
   computeSkillCost,
   recomputeSkillCosts
}

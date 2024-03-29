import { LogicOp } from '@app/core/ruleset/ops'
import { GameContext } from '@app/core/game_context'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '@app/core/ruleset/items/potential'
import { MaybeTranslationKey } from '@app/core/base/uid'
import { Skill, SkillCost, SkillPotential } from '@app/core/ruleset/items/skill'
import { AscensionPerk } from '@app/core/ruleset/items/ascension_perk'
import {
   Modifier,
   ModifierValue,
   SkillPointCostModifier,
   ValueSource
} from '@app/core/ruleset/items/modifier'
import { SkillCategoryId } from '@app/core/ruleset'
import { popScope, pushScope } from '@app/core/game_context/scope'
import { MaybeTranslatable } from '@app/core/base/translation'
import { PropertyId } from '@app/core/game_context/player'

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
      } catch (e: any) {
         console.error(`[E] [computePotential] 计算 potential 表达式时遇到错误: ${e}\n${e.stack}`)
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
         console.error(`[E] [computeSkillPotential] 技能 '${skillPotential}' 不存在`)
         return {
            skillId,
            skillName: '@unknown_skill_name',
            result: false,
            neverAgain: true
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

   const { base, properties } = skillCost
   console.debug(`[D] [computeSkillCost] 基础消耗 = ${base}, 属性值需求 = ${properties}`)
   let totalDiffRatio = 0.0
   if (properties) {
      for (const propertyId in properties) {
         const propertyValue = gameContext.getPropertyValue(propertyId) ?? 0
         const expectedPropertyValue = properties[propertyId]

         if (expectedPropertyValue) {
            const diff = propertyValue - expectedPropertyValue
            console.debug(
               `[D] [computeSkillCost] gameContext.player.attributes[${propertyId}] = ${propertyValue}` +
               `, attributes[${propertyId}] = ${expectedPropertyValue}` +
               `, 差值 = ${diff}`
            )
            if (diff < 0) {
               totalDiffRatio += -(diff / expectedPropertyValue)
               console.debug(`[D] [computeSkillCost] 差值贡献 = ${-(diff / expectedPropertyValue)}`)
            }
         }
      }
   }
   totalDiffRatio *= 3.0
   if (totalDiffRatio > 10.0) {
      totalDiffRatio = 10.0
   }

   let cost = Math.round(base * (1.0 + totalDiffRatio) * modifier)
   if (cost > 999) {
      cost = 999
   }
   return Math.floor(cost)
}

export class AvailableSkill {
   readonly skill: Skill
   readonly cost: number

   constructor(skill: Skill, cost: number) {
      this.skill = skill
      this.cost = cost
   }
}

export interface UnavailableSkill {
   readonly skill: Skill
   readonly resultPieces: SkillPotentialResult[]
}

export interface ComputedSkills {
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
         console.debug(`[D] [computePotentialSkills] 技能 '${ident}' 可用，需要 ${cost} 技能点数`)
         available[identStr] = { skill, cost }
      } else {
         console.debug(`[D] [computePotentialSkills] 技能 '${ident}' 不可用`)
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
}

export interface UnavailableAscensionPerk {
   readonly ascensionPerk: AscensionPerk
   readonly resultPieces: PotentialResult[]
}

export interface ComputedAscensionPerks {
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

      console.debug(`[D] [computePotentialAscensionPerks] 正在计算飞升项目 '${ident}' 的可用性`)
      if (result) {
         console.debug(`[D] [computePotentialAscensionPerks] 飞升项目 '${ident}' 可用`)
         available[identStr] = ascensionPerk
      } else {
         console.debug(`[D] [computePotentialAscensionPerks] 飞升项目 '${ident}' 不可用: ${result}`)
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
}

export interface IContribution {
   name: MaybeTranslationKey
   value: number
   icon?: string
}

// note: gain/loss values may exceed, but that does not matter.
// normalization will be done when property modifier get applied.
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

export type ComputedPlayerModifier = Record<PropertyId, ComputedPropertyModifier>

export class ComputedSkillPointCostModifier {
   computedValue: number = 0.0
   contributions: IContribution[] = []

   addContribution(name: MaybeTranslationKey, value: number, icon?: string) {
      this.computedValue += value
      this.contributions.push({ name, value, icon })
   }
}

export class ComputedModifier {
   player: Record<'all' | ValueSource, ComputedPlayerModifier> = {}
   skillPointCost: Record<'all' | SkillCategoryId, ComputedSkillPointCostModifier> = {}

   getPlayerModifier(
      valueSource: 'all' | ValueSource,
      propertyId: PropertyId
   ): ComputedPropertyModifier | undefined {
      const playerModifier = this.player[valueSource]
      if (!playerModifier) {
         return undefined
      }

      return playerModifier[propertyId]
   }

   getSkillPointCostModifier(skillCategoryId: 'all' | SkillCategoryId): ComputedSkillPointCostModifier | undefined {
      return this.skillPointCost[skillCategoryId]
   }
}

export function computeModifier(gameContext: GameContext) {
   gameContext.state.computedModifier = new ComputedModifier()
   const computed = gameContext.state.computedModifier

   for (const modifierId of gameContext.state.modifiers) {
      const modifier: Modifier = gameContext.ruleSet.modifiers[modifierId]
      if (!modifier) {
         console.error(`[E] [computeModifier] 修正 '${modifierId}' 不存在`)
         continue
      }

      const { name, icon, playerProperty: playerModifier, skillPointCost } = modifier

      if (playerModifier) {
         for (const propertyId in playerModifier) {
            const propertyModifier = playerModifier[propertyId]
            for (const valueSource in propertyModifier) {
               if (!computed.player[valueSource]) {
                  computed.player[valueSource] = {}
               }

               if (!computed.player[valueSource][propertyId]) {
                  computed.player[valueSource][propertyId] = new ComputedPropertyModifier()
               }

               const value = propertyModifier[valueSource]
               const dest = computed.player[valueSource][propertyId]
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

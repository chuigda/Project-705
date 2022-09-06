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

export class PotentialResultBase {
   readonly result: boolean
}

export class PotentialFunctionResult extends PotentialResultBase {
   readonly description: string
}

export class PotentialLogicOpResult extends PotentialResultBase {
   readonly op: LogicOp
   readonly resultPieces: PotentialResult[]
}

export function computePotential(gameContext: GameContext, potential: PotentialExpression): PotentialResult {
   if (potential instanceof PotentialExpressionFunctionOp) {
      let result
      try {
         result = potential.op(gameContext)
      } catch (e) {
         console.error('')
         result = false
      }
      return {
         result,
         description: potential.description
      }
   } else {
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
         op: potential.op,
         resultPieces
      }
   }
}

export type PotentialResult = PotentialFunctionResult | PotentialLogicOpResult

export class HasSkillOrNot extends PotentialResultBase {
   readonly skillId: string
   readonly skillName: MaybeTranslationKey
}

export type SkillPotentialResult = PotentialResult | HasSkillOrNot

export function computeSkillPotential(gameContext: GameContext, skillPotential: SkillPotential): SkillPotentialResult {
   if (skillPotential instanceof PotentialExpressionFunctionOp
       || skillPotential instanceof PotentialExpressionLogicOp) {
      return computePotential(gameContext, skillPotential)
   } else {
      const skillId = <string>skillPotential
      const skill = gameContext.ruleSet.skills[skillId]
      if (!skill) {
         console.error(`[E] [computeSkillPotential] skill '${skillPotential}' does not exist`)
         return {
            result: false,
            skillId: '@unknown_skill',
            skillName: '@unknown_skill_name'
         }
      }

      return {
         result: !!gameContext.state.player.skills[skillId],
         skillId,
         skillName: skill.name
      }
   }
}

export function computeSkillCost(gameContext: GameContext, skillCost: SkillCost): number {
   // TODO(?): compute skill cost modifiers here

   if (!skillCost || !skillCost.base) {
      return 0
   }

   const { base, attributes } = skillCost
   console.debug(`[D] [computeSkillCost] base cost = ${base}, attributes = ${attributes}`)
   let totalDiffRatio = 0.0
   if (attributes) {
      for (const attrName in attributes) {
         const attribute = gameContext.state.player.attributes[<keyof PlayerAttributes>attrName]
         const requiredAttribute = attributes[<keyof PlayerAttributesUpdate>(attrName)]

         if (requiredAttribute) {
            const diff = attribute - requiredAttribute
            console.debug(`[D] [computeSkillCost] gameContext.player.attributes[${attrName}]`
               + `= ${attribute}`
               + `, attributes[${attrName}] = ${requiredAttribute}`
               + `, diff = ${diff}`)
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

   let cost = base * (1.0 + totalDiffRatio)
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

   const { skills } = gameContext.ruleSet

   const { skills: learntSkills } = gameContext.state.player
   for (const skill of Object.values(skills)) {
      const { ident, potential } = skill
      const identStr = <string>ident

      if (learntSkills[identStr]) {
         console.debug(`[D] [computePotentialSkills] skipping already learned skill: '${ident}'`)
         continue
      }

      let result = true
      const resultPieces: SkillPotentialResult[] = []
      if (potential) {
         for (const potentialPart of potential) {
            resultPieces.push(computeSkillPotential(gameContext, potentialPart))
         }
         result = resultPieces.every(piece => piece.result)
      }

      if (result) {
         const cost = computeSkillCost(gameContext, skill.cost)
         console.debug(`[D] [computePotentialSkills] skill '${ident}' available, it costs: ${cost}`)
         gameContext.state.computedSkills!.available[identStr] = { skill, cost }
      } else {
         console.debug(`[D] [computePotentialSkills] skill '${ident}' not available`)
         gameContext.state.computedSkills!.unavailable[identStr] = { skill, resultPieces }
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
      const newCost = computeSkillCost(gameContext, cost)
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

   const { ascensionPerks } = gameContext.ruleSet
   const { ascensionPerks: activatedAscensionPerks } = gameContext.state.player

   for (const ascensionPerk of Object.values(ascensionPerks)) {
      const { ident, potential } = ascensionPerk
      const identStr = <string>ident
      if (activatedAscensionPerks[identStr]) {
         console.info(`[I] [computePotentialAscensionPerks] skipping already activated ascension perk: '${ident}'`)
         continue
      }

      let result = true
      let resultPieces: PotentialResult[] = []
      if (potential) {
         resultPieces = potential.map(potentialPart => computePotential(gameContext, potentialPart))
         result = resultPieces.every(piece => piece.result)
      }

      console.info(`[I] [computePotentialAscensionPerks] computed ascension perk '${ident}': ${result}`)
      if (result) {
         available[identStr] = ascensionPerk
      } else {
         unavailable[identStr] = { ascensionPerk, resultPieces }
      }
   }

   gameContext.state.computedAscensionPerks = { available, unavailable }
   gameContext.updateTracker.computedAscensionPerks = true
}

export default {
   computePotential,
   computeSkillPotential,
   computeSkillCost,
   recomputeSkillCosts
}

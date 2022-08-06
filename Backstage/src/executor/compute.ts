import { LogicOp } from '../ruleset/ops'
import { GameContext, PlayerAttributes } from './game_context'
import {
   PotentialExpression,
   PotentialExpressionFunctionOp,
   PotentialExpressionLogicOp
} from '../ruleset/items/potential'
import { MaybeTranslationKey } from '../base/uid'
import { Skill, SkillCost, SkillPotential } from '../ruleset/items/skill'
import { AscensionPerk } from '../ruleset/items/ascension_perk'

export type PotentialResultType = 'custom' | 'logic_op' | 'skill'

export class PotentialResultBase {
   readonly type: PotentialResultType
   readonly result: boolean

   constructor(type: PotentialResultType, result: boolean) {
      this.type = type
      this.result = result
   }
}

export class PotentialFunctionResult extends PotentialResultBase {
   readonly description: string

   constructor(result: boolean, description: string) {
      super('custom', result)
      this.description = description
   }
}

export class PotentialLogicOpResult extends PotentialResultBase {
   readonly op: LogicOp
   readonly resultPieces: PotentialResult[]

   constructor(result: boolean, op: LogicOp, resultPieces: PotentialResult[]) {
      super('logic_op', result)
      this.op = op
      this.resultPieces = resultPieces
   }
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
      return new PotentialFunctionResult(result, potential.description)
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
      return new PotentialLogicOpResult(result, potential.op, resultPieces)
   }
}

export type PotentialResult = PotentialFunctionResult | PotentialLogicOpResult

export class HasSkillOrNot extends PotentialResultBase {
   readonly skillId: string
   readonly skillName: MaybeTranslationKey

   constructor(result: boolean, skillId: string, skillName: MaybeTranslationKey) {
      super('skill', result)
      this.skillId = skillId
      this.skillName = skillName
   }
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
         return new HasSkillOrNot(false, '@unknown_skill', '@unknown_skill_name')
      }

      return new HasSkillOrNot(!!gameContext.player.skills[skillId], skillId, skill.name)
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
         const attrName1 = <keyof PlayerAttributes>attrName

         const diff = gameContext.player.attributes[attrName1] - attributes[attrName1]
         console.debug(`[D] [computeSkillCost] gameContext.player.attributes[${attrName1}]`
            + `= ${gameContext.player.attributes[attrName1]}`
            + `, attributes[${attrName}] = ${attributes[attrName1]}`
            + `, diff = ${diff}`)
         if (diff < 0) {
            totalDiffRatio += -(diff / attributes[attrName1])
            console.debug(`[D] [computeSkillCost] diff contribution = ${-(diff / attributes[attrName1])}`)
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

   constructor(skill: Skill, cost: number) {
      this.skill = skill
      this.cost = cost
   }
}

export class UnavailableSkill {
   readonly skill: Skill
   readonly resultPieces: SkillPotentialResult[]

   constructor(skill: Skill, resultPieces: SkillPotentialResult[]) {
      this.skill = skill
      this.resultPieces = resultPieces
   }
}

export class ComputedSkills {
   available: Record<string, AvailableSkill>
   unavailable: Record<string, UnavailableSkill>

   constructor(available: Record<string, AvailableSkill>, unavailable: Record<string, UnavailableSkill>) {
      this.available = available
      this.unavailable = unavailable
   }
}

export function computePotentialSkills(gameContext: GameContext) {
   const available: Record<string, AvailableSkill> = {}
   const unavailable: Record<string, UnavailableSkill> = {}

   const { skills } = gameContext.ruleSet

   const { skills: learntSkills } = gameContext.player
   for (const skill of Object.values(skills)) {
      const { ident, potential } = skill
      const identStr = <string>ident

      if (learntSkills[identStr]) {
         console.debug(`[D] [computePotentialSkills] skipping already learned skill: '${ident}'`)
         continue
      }

      let result = true
      const resultPieces = []
      if (potential) {
         for (const potentialPart of potential) {
            resultPieces.push(computeSkillPotential(gameContext, potentialPart))
         }
         result = resultPieces.every(piece => piece.result)
      }

      if (result) {
         const cost = computeSkillCost(gameContext, skill.cost)
         console.debug(`[D] [computePotentialSkills] skill '${ident}' available, it costs: ${cost}`)
         gameContext.computedSkills.available[identStr] = new AvailableSkill(skill, cost)
      } else {
         console.debug(`[D] [computePotentialSkills] skill '${ident}' not available`)
         gameContext.computedSkills.unavailable[identStr] = new UnavailableSkill(skill, resultPieces)
      }
   }

   if (!gameContext.computedSkills) {
      gameContext.computedSkills = new ComputedSkills(available, unavailable)
   } else {
      gameContext.computedSkills.available = available
      gameContext.computedSkills.unavailable = unavailable
   }
}

export function recomputeSkillCosts(gameContext: GameContext) {
   const available: Record<string, AvailableSkill> = {}
   for (const { skill } of Object.values(gameContext.computedSkills.available)) {
      const { ident, cost } = skill
      const newCost = computeSkillCost(gameContext, cost)
      console.debug(`[D] [recomputeSkillCosts] skill '${ident}' costs ${newCost}`)

      available[<string>ident] = new AvailableSkill(skill, newCost)
   }
   gameContext.computedSkills.available = available
}

export class UnavailableAscensionPerk {
   readonly ascensionPerk: AscensionPerk
   readonly resultPieces: PotentialResult[]

   constructor(ascensionPerk: AscensionPerk, resultPieces: PotentialResult[]) {
      this.ascensionPerk = ascensionPerk
      this.resultPieces = resultPieces
   }
}

export class ComputedAscensionPerks {
   readonly available: Record<string, AscensionPerk>
   readonly unavailable: Record<string, UnavailableAscensionPerk>

   constructor(
      available: Record<string, AscensionPerk>,
      unavailable: Record<string, UnavailableAscensionPerk>
   ) {
      this.available = available
      this.unavailable = unavailable
   }
}

export function computePotentialAscensionPerks(gameContext: GameContext) {
   const available: Record<string, AscensionPerk> = {}
   const unavailable: Record<string, UnavailableAscensionPerk> = {}

   const { ascensionPerks } = gameContext.ruleSet
   const { ascensionPerks: activatedAscensionPerks } = gameContext.player

   for (const ascensionPerk of Object.values(ascensionPerks)) {
      const { ident, potential } = ascensionPerk
      const identStr = <string>ident
      if (ascensionPerks[identStr]) {
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
         unavailable[identStr] = new UnavailableAscensionPerk(ascensionPerk, resultPieces)
      }
   }
}

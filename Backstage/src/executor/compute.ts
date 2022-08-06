import { LogicOp } from '../ruleset/ops'
import { GameContext } from './game_context'
import { PotentialExpression, PotentialExpressionFunctionOp } from '../ruleset/items/potential'
import { MaybeTranslationKey } from '../base/uid'
import { Skill } from '../ruleset/items/skill'
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

   constructor(skillId: string, skillName: MaybeTranslationKey, result: boolean) {
      super('skill', result)
      this.skillId = skillId
      this.skillName = skillName
   }
}

export type SkillPotentialResult = PotentialResult | HasSkillOrNot

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
   readonly available: Record<string, AvailableSkill>
   readonly unavailable: Record<string, UnavailableSkill>

   constructor(available: Record<string, AvailableSkill>, unavailable: Record<string, UnavailableSkill>) {
      this.available = available
      this.unavailable = unavailable
   }
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

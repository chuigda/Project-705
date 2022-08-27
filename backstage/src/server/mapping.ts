import {
   AvailableSkill,
   ComputedAscensionPerks,
   ComputedSkills,
   HasSkillOrNot,
   PotentialFunctionResult,
   PotentialResult,
   SkillPotentialResult,
   UnavailableAscensionPerk,
   UnavailableSkill
} from '@app/executor/compute'
import { GameState, PlayerAttributes, PlayerStatus } from '@app/executor/game_context'
import { Activity, ActivityOutput, AscensionPerk, Skill, SkillCost, SkillOutput } from '@app/ruleset'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import {
   IActivity,
   IActivityOutput,
   IAscensionPerk,
   IAvailableSkill,
   IComputedAscensionPerks,
   IComputedSkills,
   IGameState,
   IPartialPlayerAttributes,
   IPlayerAttributes,
   IPlayerStatus,
   IPotentialResult,
   ISkill,
   ISkillCost,
   ISkillOutput,
   ISkillPotentialResult,
   IUnavailableAscensionPerk,
   IUnavailableSkill
} from '@protocol/src'

export function toProtoPartialPlayerAttributes(pa: PlayerAttributesUpdate): IPartialPlayerAttributes {
   return {
      strength: pa.strength,
      intelligence: pa.intelligence,
      emotionalIntelligence: pa.emotionalIntelligence,
      memorization: pa.memorization,
      imagination: pa.imagination,
      charisma: pa.charisma
   }
}

export function toProtoPlayerAttributes(pa: PlayerAttributes): IPlayerAttributes {
   return {
      strength: pa.strength,
      intelligence: pa.intelligence,
      emotionalIntelligence: pa.emotionalIntelligence,
      memorization: pa.memorization,
      imagination: pa.imagination,
      charisma: pa.charisma
   }
}

export function toProtoSkillCost(sc: SkillCost): ISkillCost {
   return {
      base: sc.base,
      attributes: sc.attributes && toProtoPartialPlayerAttributes(sc.attributes)
   }
}

export function toProtoSkillOutput(so: SkillOutput): ISkillOutput {
   return {
      attributes: toProtoPartialPlayerAttributes(so.attributes)
   }
}

export function toProtoSkill(s: Skill): ISkill {
   return {
      ident: <string>s.ident,
      name: s.name,
      description: s.description,
      category: s.category,
      cost: s.cost,
      output: s.output && toProtoSkillOutput(s.output),
      activities: s.activities && <string[]>s.activities
   }
}

export function toProtoActivityOutput(ao: ActivityOutput): IActivityOutput {
   return {
      attributes: ao.attributes && toProtoPartialPlayerAttributes(ao.attributes),
      skillPoints: ao.skillPoints,
      pressure: ao.pressure,
      satisfactory: ao.satisfactory,
      money: ao.money
   }
}

export function toProtoActivity(a: Activity): IActivity {
   return {
      ident: <string>a.ident,
      name: a.name,
      description: a.description,
      category: a.category,
      level: a.level,
      output: a.output && toProtoActivityOutput(a.output)
   }
}

export function toProtoAscensionPerk(a: AscensionPerk): IAscensionPerk {
   return {
      ident: <string>a.ident,
      name: a.name,
      description: a.description
   }
}

export function toProtoPlayerStatus(ps: PlayerStatus): IPlayerStatus {
   return {
      attributes: toProtoPlayerAttributes(ps.attributes),
      talent: toProtoPlayerAttributes(ps.attributes),
      skillPoints: ps.skillPoints,
      skills: Object.fromEntries(Object.keys(ps.skills).map((k) => [k, toProtoSkill(ps.skills[k])])),
      activities: Object.fromEntries(Object.keys(ps.activities).map((k) => [k, toProtoActivity(ps.activities[k])])),
      ascensionPerks: Object.fromEntries(
         Object.keys(ps.ascensionPerks).map((k) => [k, toProtoAscensionPerk(ps.ascensionPerks[k])])
      ),
      pressure: ps.pressure,
      satisfactory: ps.satisfactory,
      money: ps.money,
      moneyPerTurn: ps.moneyPerTurn
   }
}

export function toProtoAvailableSkill(as: AvailableSkill): IAvailableSkill {
   return {
      skill: toProtoSkill(as.skill),
      cost: as.cost
   }
}

export function toProtoPotentialResult(pr: PotentialResult): IPotentialResult {
   if (pr instanceof PotentialFunctionResult) {
      return {
         type: 'fn',
         result: pr.result,
         description: pr.description
      }
   }
   return {
      type: 'logicOp',
      result: pr.result,
      resultPieces: pr.resultPieces.map((p) => toProtoPotentialResult(p))
   }
}

export function toProtoSkillPotentialResult(spr: SkillPotentialResult): ISkillPotentialResult {
   if (spr instanceof HasSkillOrNot) {
      return {
         type: 'skill',
         result: spr.result,
         skillId: spr.skillId,
         skillName: spr.skillName
      }
   }
   return toProtoPotentialResult(spr)
}

export function toProtoUnavailableSkill(us: UnavailableSkill): IUnavailableSkill {
   return {
      skill: toProtoSkill(us.skill),
      resultPieces: us.resultPieces.map((r) => toProtoSkillPotentialResult(r))
   }
}

export function toProtoComputedSkills(cs: ComputedSkills): IComputedSkills {
   return {
      available: Object.values(cs.available).map((x) => toProtoAvailableSkill(x)),
      unavailable: Object.values(cs.unavailable).map((x) => toProtoUnavailableSkill(x))
   }
}

export function toProtoUnavailableAscensionPerks(uap: UnavailableAscensionPerk): IUnavailableAscensionPerk {
   return {
      ascensionPerk: toProtoAscensionPerk(uap.ascensionPerk),
      resultPieces: uap.resultPieces.map((r) => toProtoPotentialResult(r))
   }
}

export function toProtoComputedAscensionPerks(ap: ComputedAscensionPerks): IComputedAscensionPerks {
   return {
      available: Object.values(ap.available).map((x) => toProtoAscensionPerk(x)),
      unavailable: Object.values(ap.unavailable).map((x) => toProtoUnavailableAscensionPerks(x))
   }
}

export function toProtoGameState(gs: GameState): IGameState {
   return {
      turns: gs.turns,
      player: toProtoPlayerStatus(gs.player),

      modifiers: gs.modifiers,
      variables: gs.variables,

      computedModifiers: gs.computedModifier,
      computedSkills: gs.computedSkills && toProtoComputedSkills(gs.computedSkills),
      computedAscensionPerks: gs.computedAscensionPerks && toProtoComputedAscensionPerks(gs.computedAscensionPerks)
   }
}

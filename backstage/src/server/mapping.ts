import {
   AvailableSkill,
   ComputedAscensionPerks,
   ComputedSkills,
   HasSkillOrNot, isHasSkillOrNot, isPotentialFunctionResult, PotentialFunctionResult, PotentialLogicOpResult,
   PotentialResult,
   SkillPotentialResult,
   UnavailableAscensionPerk,
   UnavailableSkill
} from '@app/executor/compute'
import {
   GameState,
   PlayerAttributes,
   PlayerStatus,
   PlayerStatusUpdateTracker,
   UpdateTracker
} from '@app/executor/game_context'
import {
   Activity,
   ActivityOutput,
   AscensionPerk,
   Skill,
   SkillCost,
   SkillOutput,
   Startup,
   StartupPlayerProperties
} from '@app/ruleset'
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
   IStartup,
   IStartupPlayerProperties,
   IUnavailableAscensionPerk,
   IUnavailableSkill
} from '@protocol/index'

export function sendPartialPlayerAttributes(pa: PlayerAttributesUpdate): IPartialPlayerAttributes {
   return {
      strength: pa.strength,
      intelligence: pa.intelligence,
      emotionalIntelligence: pa.emotionalIntelligence,
      memorization: pa.memorization,
      imagination: pa.imagination,
      charisma: pa.charisma
   }
}

export function sendPlayerAttributes(pa: PlayerAttributes): IPlayerAttributes {
   return {
      strength: pa.strength,
      intelligence: pa.intelligence,
      emotionalIntelligence: pa.emotionalIntelligence,
      memorization: pa.memorization,
      imagination: pa.imagination,
      charisma: pa.charisma
   }
}

export function sendSkillCost(sc: SkillCost): ISkillCost {
   return {
      base: sc.base,
      attributes: sc.attributes && sendPartialPlayerAttributes(sc.attributes)
   }
}

export function sendSkillOutput(so: SkillOutput): ISkillOutput {
   return {
      attributes: sendPartialPlayerAttributes(so.attributes)
   }
}

export function sendSkill(s: Skill): ISkill {
   return {
      ident: <string>s.ident,
      name: s.name,
      description: s.description,
      category: s.category,
      cost: sendSkillCost(s.cost),
      output: s.output && sendSkillOutput(s.output),
      activities: s.activities && <string[]>s.activities
   }
}

export function sendActivityOutput(ao: ActivityOutput): IActivityOutput {
   return {
      attributes: ao.attributes && sendPartialPlayerAttributes(ao.attributes),
      skillPoints: ao.skillPoints,
      mentalHealth: ao.mentalHealth,
      satisfactory: ao.satisfactory,
      money: ao.money
   }
}

export function sendActivity(a: Activity): IActivity {
   return {
      ident: <string>a.ident,
      name: a.name,
      description: a.description,
      category: a.category,
      level: a.level,
      output: a.output && sendActivityOutput(a.output)
   }
}

export function sendAscensionPerk(a: AscensionPerk): IAscensionPerk {
   return {
      ident: <string>a.ident,
      name: a.name,
      description: a.description
   }
}

export function sendPlayerStatus(ps: PlayerStatus, updateTracker?: PlayerStatusUpdateTracker): IPlayerStatus {
   function makeSendTs<T, V>(sender: (t: T) => V): (ts: Record<string, T>) => V[] {
      return (ts: Record<string, T>) => Object.values(ts).map(sender)
   }

   const sendSkills = makeSendTs(sendSkill)
   const sendActivities = makeSendTs(sendActivity)
   const sendAscensionPerks = makeSendTs(sendAscensionPerk)

   if (!updateTracker) {
      return {
         attributes: sendPlayerAttributes(ps.attributes),
         talent: sendPlayerAttributes(ps.talent),
         skillPoints: ps.skillPoints,
         skills: sendSkills(ps.skills),
         activities: sendActivities(ps.activities),
         ascensionPerks: sendAscensionPerks(ps.ascensionPerks),
         pressure: ps.mentalHealth,
         satisfactory: ps.satisfactory,
         money: ps.money,
         moneyPerTurn: ps.moneyPerTurn
      }
   } else {
      return {
         attributes: updateTracker.properties ? sendPlayerAttributes(ps.attributes) : undefined,
         talent: updateTracker.properties ? sendPlayerAttributes(ps.talent) : undefined,
         skillPoints: updateTracker.properties ? ps.skillPoints : undefined,
         pressure: updateTracker.properties ? ps.mentalHealth : undefined,
         satisfactory: updateTracker.properties ? ps.satisfactory : undefined,
         money: updateTracker.properties ? ps.money : undefined,
         moneyPerTurn: updateTracker.properties ? ps.moneyPerTurn : undefined,

         skills: updateTracker.skills ? sendSkills(ps.skills) : undefined,
         activities: updateTracker.activities ? sendActivities(ps.activities) : undefined,
         ascensionPerks: updateTracker.ascensionPerks ? sendAscensionPerks(ps.ascensionPerks) : undefined
      }
   }
}

export function sendAvailableSkill(as: AvailableSkill): IAvailableSkill {
   return {
      skill: sendSkill(as.skill),
      cost: as.cost
   }
}

export function sendPotentialResult(pr: PotentialResult): IPotentialResult {
   if (isPotentialFunctionResult(pr)) {
      pr = <PotentialFunctionResult>pr
      return {
         type: 'fn',
         result: pr.result,
         description: pr.description
      }
   }

   pr = <PotentialLogicOpResult>pr
   return {
      type: 'logicOp',
      result: pr.result,
      resultPieces: pr.resultPieces.map(p => sendPotentialResult(p))
   }
}

export function sendSkillPotentialResult(spr: SkillPotentialResult): ISkillPotentialResult {
   if (isHasSkillOrNot(spr)) {
      spr = <HasSkillOrNot>spr
      return {
         type: 'skill',
         result: spr.result,
         skillId: spr.skillId,
         skillName: spr.skillName
      }
   } else {
      return sendPotentialResult(<PotentialResult>spr)
   }
}

export function sendUnavailableSkill(us: UnavailableSkill): IUnavailableSkill {
   return {
      skill: sendSkill(us.skill),
      resultPieces: us.resultPieces.map(r => sendSkillPotentialResult(r))
   }
}

export function sendComputedSkills(cs: ComputedSkills): IComputedSkills {
   return {
      available: Object.values(cs.available).map(x => sendAvailableSkill(x)),
      unavailable: Object.values(cs.unavailable).map(x => sendUnavailableSkill(x))
   }
}

export function sendUnavailableAscensionPerks(uap: UnavailableAscensionPerk): IUnavailableAscensionPerk {
   return {
      ascensionPerk: sendAscensionPerk(uap.ascensionPerk),
      resultPieces: uap.resultPieces.map(r => sendPotentialResult(r))
   }
}

export function sendComputedAscensionPerks(ap: ComputedAscensionPerks): IComputedAscensionPerks {
   return {
      available: Object.values(ap.available).map(x => sendAscensionPerk(x)),
      unavailable: Object.values(ap.unavailable).map(x => sendUnavailableAscensionPerks(x))
   }
}

export function sendStartupPlayerProperties(properties: StartupPlayerProperties): IStartupPlayerProperties {
   return {
      ...properties,

      attributes: properties.attributes ? sendPartialPlayerAttributes(properties.attributes) : undefined,
      talent: properties.talent ? sendPartialPlayerAttributes(properties.talent) : undefined
   }
}

export function sendStartup(startup: Startup): IStartup {
   return {
      ident: <string>startup.ident,
      name: startup.name,
      description: startup.description,

      player: startup.player ? sendStartupPlayerProperties(startup.player) : undefined
   }
}

export function sendGameState(gs: GameState, updateTracker?: UpdateTracker): IGameState {
   if (!updateTracker) {
      return {
         startup: gs.startup,
         turns: gs.turns,
         player: sendPlayerStatus(gs.player, undefined),

         modifiers: gs.modifiers,
         variables: gs.variables,

         // TODO(chuigda): transpile ComputedModifier
         // computedModifiers: gs.computedModifier,
         computedSkills: sendComputedSkills(gs.computedSkills!),
         computedAscensionPerks: sendComputedAscensionPerks(gs.computedAscensionPerks!)
      }
   } else {
      return {
         startup: gs.startup,
         turns: gs.turns,
         player: updateTracker.player.any() ? sendPlayerStatus(gs.player, updateTracker.player) : undefined,

         modifiers: gs.modifiers,
         variables: updateTracker.variables ? gs.variables : undefined,

         // computedModifiers: updateTracker.computedModifiers ? gs.computedModifier : undefined,
         computedSkills: updateTracker.computedSkills ? sendComputedSkills(gs.computedSkills!) : undefined,
         computedAscensionPerks: updateTracker.computedAscensionPerks
            ? sendComputedAscensionPerks(gs.computedAscensionPerks!)
            : undefined
      }
   }
}

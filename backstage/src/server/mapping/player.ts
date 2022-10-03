import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { IPartialPlayerAttributes, IPlayerAttributes, IPlayerStatus } from '@protocol/player'
import { PlayerAttributes, PlayerStatus, PlayerStatusUpdateTracker } from '@app/executor/game_context'

import { sendActivity } from './activity'
import { sendSkill } from './skill'
import { sendAscensionPerk } from './ascension_perk'

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
         energy: ps.energy,
         energyMax: ps.energyMax,
         skillPoints: ps.skillPoints,
         skills: sendSkills(ps.skills),
         activities: sendActivities(ps.activities),
         ascensionPerks: sendAscensionPerks(ps.ascensionPerks),
         ascensionPerkSlots: ps.ascensionPerkSlots,
         mentalHealth: ps.mentalHealth,
         mentalHealthMax: ps.mentalHealthMax,
         satisfactory: ps.satisfactory,
         money: ps.money,
         moneyPerTurn: ps.moneyPerTurn
      }
   } else {
      return {
         attributes: updateTracker.properties ? sendPlayerAttributes(ps.attributes) : undefined,
         talent: updateTracker.properties ? sendPlayerAttributes(ps.talent) : undefined,
         skillPoints: updateTracker.properties ? ps.skillPoints : undefined,
         mentalHealth: updateTracker.properties ? ps.mentalHealth : undefined,
         mentalHealthMax: updateTracker.properties ? ps.mentalHealthMax : undefined,
         satisfactory: updateTracker.properties ? ps.satisfactory : undefined,
         money: updateTracker.properties ? ps.money : undefined,
         moneyPerTurn: updateTracker.properties ? ps.moneyPerTurn : undefined,

         skills: updateTracker.skills ? sendSkills(ps.skills) : undefined,
         activities: updateTracker.activities ? sendActivities(ps.activities) : undefined,
         ascensionPerks: updateTracker.ascensionPerks ? sendAscensionPerks(ps.ascensionPerks) : undefined,
         ascensionPerkSlots: ps.ascensionPerkSlots,
      }
   }
}


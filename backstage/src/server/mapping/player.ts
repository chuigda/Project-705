import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import {
   IPartialPlayerAttributes,
   IPlayerAttributes,
   IPlayerStatus,
   IPlayerItems, IPlayerConsumableItem, IPlayerRechargeableItem, IPlayerActiveRelicItem, IPlayerTradableItem
} from '@protocol/player'
import {
   PlayerAttributes,
   PlayerStatus,
   PlayerStatusUpdateTracker,
   PlayerItems, PlayerConsumableItem, PlayerRechargeableItem, PlayerActiveRelicItem, PlayerTradableItem
} from '@app/executor/game_context'

import { sendActivity } from './activity'
import { sendAscensionPerk } from './ascension_perk'
import { sendSkill } from './skill'
import {
   sendActiveRelicItem,
   sendConsumableItem, sendPassiveRelicItem,
   sendRechargeableItem,
   sendTradableItem
} from './store_item'

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

export function sendPlayerConsumableItem(playerItem: PlayerConsumableItem): IPlayerConsumableItem {
   const { item, totalChargeLevel } = playerItem
   return {
      item: sendConsumableItem(item),
      totalChargeLevel
   }
}

export function sendPlayerRechargeableItem(playerItem: PlayerRechargeableItem): IPlayerRechargeableItem {
   const { item, chargeLevel } = playerItem
   return {
      item: sendRechargeableItem(item),
      chargeLevel
   }
}

export function sendPlayerActiveRelicItem(playerItem: PlayerActiveRelicItem): IPlayerActiveRelicItem {
   const { item, cooldown } = playerItem
   return {
      item: sendActiveRelicItem(item),
      cooldown
   }
}

export function sendPlayerTradableItem(playerItem: PlayerTradableItem): IPlayerTradableItem {
   const { item, count } = playerItem
   return {
      item: sendTradableItem(item),
      count
   }
}

export function sendPlayerItems(items: PlayerItems): IPlayerItems {
   function sendItems<T, U>(series: Record<string, T>, fn: (t: T) => U): U[] {
      return Object.values(series).map(fn)
   }

   return {
      consumableItems: sendItems(items.consumableItems, sendPlayerConsumableItem),
      rechargeableItems: sendItems(items.rechargeableItems, sendPlayerRechargeableItem),
      activeRelicItems: sendItems(items.activeRelicItems, sendPlayerActiveRelicItem),
      passiveRelicItems: sendItems(items.passiveRelicItems, sendPassiveRelicItem),
      tradableItems: sendItems(items.tradableItems, sendPlayerTradableItem)
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
         moneyPerTurn: ps.moneyPerTurn,
         items: sendPlayerItems(ps.items)
      }
   } else {
      return {
         attributes: updateTracker.properties ? sendPlayerAttributes(ps.attributes) : undefined,
         talent: updateTracker.properties ? sendPlayerAttributes(ps.talent) : undefined,
         energy: updateTracker.properties ? ps.energy : undefined,
         energyMax: updateTracker.properties ? ps.energyMax : undefined,
         skillPoints: updateTracker.properties ? ps.skillPoints : undefined,
         mentalHealth: updateTracker.properties ? ps.mentalHealth : undefined,
         mentalHealthMax: updateTracker.properties ? ps.mentalHealthMax : undefined,
         satisfactory: updateTracker.properties ? ps.satisfactory : undefined,
         money: updateTracker.properties ? ps.money : undefined,
         moneyPerTurn: updateTracker.properties ? ps.moneyPerTurn : undefined,
         ascensionPerkSlots: updateTracker.ascensionPerkSlots ? ps.ascensionPerkSlots : undefined,

         skills: updateTracker.skills ? sendSkills(ps.skills) : undefined,
         activities: updateTracker.activities ? sendActivities(ps.activities) : undefined,
         ascensionPerks: updateTracker.ascensionPerks ? sendAscensionPerks(ps.ascensionPerks) : undefined,
         items: updateTracker.items ? sendPlayerItems(ps.items) : undefined
      }
   }
}

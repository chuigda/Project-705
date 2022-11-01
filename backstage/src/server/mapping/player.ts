import {
   IPlayerStatus,
   IPlayerItems,
   IPlayerConsumableItem,
   IPlayerRechargeableItem,
   IPlayerActiveRelicItem,
   IPlayerTradableItem, IPlayerProperty
} from '@protocol/player'
import {
   PlayerStatus,
   PlayerStatusUpdateTracker,
   PlayerItems,
   PlayerConsumableItem,
   PlayerRechargeableItem,
   PlayerActiveRelicItem,
   PlayerTradableItem, PropertyId, PlayerProperty
} from '@app/executor/game_context'
import { ITranslationKey } from '@protocol/translation'

import { sendActivity } from './activity'
import { sendAscensionPerk } from './ascension_perk'
import { sendSkill } from './skill'
import {
   sendActiveRelicItem,
   sendConsumableItem, sendPassiveRelicItem,
   sendRechargeableItem,
   sendTradableItem
} from './store_item'

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

export function sendPlayerProperties(
   properties: Record<PropertyId, PlayerProperty>
): Record<PropertyId, IPlayerProperty> {
   const ret: Record<PropertyId, IPlayerProperty> = {}
   for (const propertyId in properties) {
      const property = properties[propertyId]
      ret[propertyId] = {
         ...property,
         name: <ITranslationKey>property.name
      }
   }
   return ret
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
         properties: sendPlayerProperties(ps.properties),
         skills: sendSkills(ps.skills),
         activities: sendActivities(ps.activities),
         ascensionPerks: sendAscensionPerks(ps.ascensionPerks),
         ascensionPerkSlots: ps.ascensionPerkSlots,
         items: sendPlayerItems(ps.items)
      }
   } else {
      return {
         properties: updateTracker.properties ? sendPlayerProperties(ps.properties) : undefined,
         ascensionPerkSlots: updateTracker.ascensionPerkSlots ? ps.ascensionPerkSlots : undefined,

         skills: updateTracker.skills ? sendSkills(ps.skills) : undefined,
         activities: updateTracker.activities ? sendActivities(ps.activities) : undefined,
         ascensionPerks: updateTracker.ascensionPerks ? sendAscensionPerks(ps.ascensionPerks) : undefined,
         items: updateTracker.items ? sendPlayerItems(ps.items) : undefined
      }
   }
}

import { ISkill } from './skill'
import { IActivity } from './activity'
import { IAscensionPerk } from './ascension_perk'
import { IActiveRelicItem, IConsumableItem, IPassiveRelicItem, IRechargeableItem, ITradableItem } from './store_item'

export interface IPlayerAttributes {
   strength: number
   intelligence: number
   emotionalIntelligence: number
   memorization: number
   imagination: number
   charisma: number
}

export interface IPartialPlayerAttributes {
   strength?: number
   intelligence?: number
   emotionalIntelligence?: number
   memorization?: number
   imagination?: number
   charisma?: number
}

export interface IPlayerConsumableItem {
   item: IConsumableItem
   totalChargeLevel: number
}

export interface IPlayerRechargeableItem {
   item: IRechargeableItem
   chargeLevel: number
}

export interface IPlayerActiveRelicItem {
   item: IActiveRelicItem
   cooldown: number
}

export interface IPlayerTradableItem {
   item: ITradableItem
   count: number
}

export interface IPlayerItems {
   consumableItems: IPlayerConsumableItem[]
   rechargeableItems: IPlayerRechargeableItem[]
   activeRelicItems: IPlayerActiveRelicItem[]
   passiveRelicItems: IPassiveRelicItem[]
   tradableItems: IPlayerTradableItem[]
}

export interface IPlayerStatus {
   attributes?: IPlayerAttributes
   talent?: IPlayerAttributes

   energy?: number
   energyMax?: number
   skillPoints?: number
   skills?: ISkill[]
   activities?: IActivity[]
   ascensionPerks?: IAscensionPerk[]
   ascensionPerkSlots?: number
   items?: IPlayerItems

   mentalHealth?: number
   mentalHealthMax?: number
   satisfactory?: number
   money?: number
   moneyPerTurn?: number
}

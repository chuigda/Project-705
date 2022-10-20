import { ISkill } from './skill'
import { IActivity } from './activity'
import { IAscensionPerk } from './ascension_perk'
import {
   IActiveRelicItem,
   IConsumableItem,
   IPassiveRelicItem,
   IRechargeableItem,
   ITradableItem
} from './store_item'

export type IBuiltinPropertyName =
   // 传统意义上的 attribute
   '@intelligence'
   | '@emotionalIntelligence'
   | '@memorization'
   | '@strength'
   | '@imagination'
   | '@charisma'
   // 三相之力
   | '@energy'
   | '@money'
   | '@skillPoints'
   // 血条
   | '@mentalHealth'
   // 受伤状态
   | '@injury'
   // 满意度
   | '@satisfactory'

export type IPropertyName = IBuiltinPropertyName | string

export interface IPlayerProperty {
   value: number
   increment?: number
   min?: number
   max?: number
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
   properties: Record<IPropertyName, IPlayerProperty>
   ascensionPerkSlots?: number

   skills?: ISkill[]
   activities?: IActivity[]
   ascensionPerks?: IAscensionPerk[]
   items?: IPlayerItems
}

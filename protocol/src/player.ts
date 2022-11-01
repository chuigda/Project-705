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
import { ITranslationKey } from './translation'

/// 传统意义上的 attribute
///
/// 注意：不要在前端使用从这里导出的数组，否则可能导致问题
export const attributeIdList = [
   '@intelligence',
   '@emotional_intelligence',
   '@memorization',
   '@strength',
   '@imagination',
   '@charisma'
] as const
export type IAttributeId = (typeof attributeIdList)[number]

/// 三相之力
///
/// 注意：不要在前端使用从这里导出的数组，否则可能导致问题
export const triforceIdList = ['@energy', '@money', '@skill_point'] as const
export type ITriforceId = (typeof triforceIdList)[number]

/// 所有内建属性
///
/// 注意：不要在前端使用从这里导出的数组，否则可能导致问题
export const builtinPropertyIdList = [
   ...attributeIdList,
   ...triforceIdList,
   '@mental_health',
   '@injury',
   '@satisfactory'
] as const
export type IBuiltinPropertyId =
   IAttributeId
   | ITriforceId
   // 血条
   | '@mental_health'
   // 受伤状态
   | '@injury'
   // 满意度
   | '@satisfactory'

export type IPropertyId = IBuiltinPropertyId | string

export interface IPlayerProperty {
   name: ITranslationKey,

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
   properties?: Record<IPropertyId, IPlayerProperty>
   ascensionPerkSlots?: number

   skills?: ISkill[]
   activities?: IActivity[]
   ascensionPerks?: IAscensionPerk[]
   items?: IPlayerItems
}

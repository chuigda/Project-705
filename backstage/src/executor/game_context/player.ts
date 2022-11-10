import { IPropertyId } from '@protocol/player'
import {
   Activity,
   Skill,
   AscensionPerk,

   ConsumableItem,
   RechargeableItem,
   ActiveRelicItem,
   PassiveRelicItem,
   TradableItem,
   MaybeTranslationKey
} from '@app/ruleset'

export type PropertyId = IPropertyId

/// 玩家属性
export interface PlayerProperty {
   /// 属性名
   name: MaybeTranslationKey

   /// 当前的属性值
   value: number

   /// 属性每回合的增量
   increment?: number

   /// 最小值
   min?: number

   /// 最大值
   max?: number
}

export class PlayerConsumableItem {
   readonly item: ConsumableItem
   totalChargeLevel: number

   constructor(item: ConsumableItem, count?: number) {
      this.item = item
      this.totalChargeLevel = (count ?? 1) * item.initCharge!
   }
}

export class PlayerRechargeableItem {
   readonly item: RechargeableItem
   chargeLevel: number

   constructor(item: RechargeableItem, chargeLevel: number) {
      this.item = item
      this.chargeLevel = chargeLevel
   }

   recharge(chargeLevel?: number) {
      chargeLevel = chargeLevel || 1
      this.chargeLevel = Math.max(this.chargeLevel + chargeLevel, this.item.maxCharge!)
   }
}

export class PlayerActiveRelicItem {
   readonly item: ActiveRelicItem
   cooldown: number

   constructor(item: ActiveRelicItem) {
      this.item = item
      this.cooldown = 0
   }

   reload() {
      this.cooldown -= 1
      if (this.cooldown <= 0) {
         this.cooldown = 0
      }
   }
}

export class PlayerTradableItem {
   readonly item: TradableItem
   count: number

   constructor(item: TradableItem, count?: number) {
      this.item = item
      this.count = count || 1
   }
}

export class PlayerItems {
   consumableItems: Record<string, PlayerConsumableItem> = {}
   rechargeableItems: Record<string, PlayerRechargeableItem> = {}
   activeRelicItems: Record<string, PlayerActiveRelicItem> = {}
   passiveRelicItems: Record<string, PassiveRelicItem> = {}
   tradableItems: Record<string, PlayerTradableItem> = {}
}

export class PlayerStatus {
   properties: Record<PropertyId, PlayerProperty> = {}
   ascensionPerkSlots: number = 0

   skills: Record<string, Skill> = {}
   activities: Record<string, Activity> = {}
   ascensionPerks: Record<string, AscensionPerk> = {}
   items: PlayerItems = new PlayerItems()
}

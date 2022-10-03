import { ITranslationKey } from './translation'

export type IStoreItemLevel =
   'normal'
   | 'rare'
   | 'epic'
   | 'legend'
   | 'myth'

export type IStoreItemKind =
   'consumable'
   | 'rechargeable'
   | 'active_relic'
   | 'passive_relic'
   | 'tradable'

export interface IStoreItemBase<ItemKindString extends IStoreItemKind> {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   kind: ItemKindString
   level: IStoreItemLevel
   price?: number
   energyCost?: number
}

export interface IConsumableItem extends IStoreItemBase<'consumable'> {
   initCharge: number
}

export interface IRechargeableItem extends IStoreItemBase<'rechargeable'> {
   initCharge: number
   maxCharge: number
}

export interface IActiveRelicItem extends IStoreItemBase<'active_relic'> {
   cooldown: number
}

export type IPassiveRelicItem = IStoreItemBase<'passive_relic'>

export interface ITradableItem extends IStoreItemBase<'tradable'> {
   sellValue: number
}

import {
   ITranslationKey
} from './translation'
import { IPartialPlayerAttributes, IPlayerStatus } from './player'
import { IComputedAscensionPerks, IComputedSkills } from './computed'
import { IShopStatus } from './shop'

export * from './activity'
export * from './ascension_perk'
export * from './computed'
export * from './player'
export * from './potential'
export * from './skill'
export * from './shop'
export * from './startup'
export * from './store_item'
export * from './translation'
export * from './ui'

export interface IGameState {
   startup: string

   turns: number
   player?: IPlayerStatus
   shop?: IShopStatus

   modifiers?: string[]
   variables?: Record<string, any>

   computedModifier?: object
   computedSkills?: IComputedSkills
   computedAscensionPerks?: IComputedAscensionPerks
}

export interface IStartupPlayerProperties {
   attributes?: IPartialPlayerAttributes
   talent?: IPartialPlayerAttributes
   skillPoints?: number
   money?: number
   moneyPerTurn?: number
}

export interface IResponseSuccess<R> {
   success: true
   message: ITranslationKey
   result: R
}

export interface IResponseFail {
   success: false
   message: ITranslationKey
   result?: any
}

export type IResponse<R> = IResponseSuccess<R> | IResponseFail

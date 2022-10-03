import {
   ITranslationKey
} from './translation'
import {IPartialPlayerAttributes, IPlayerStatus} from "./player";
import {IComputedAscensionPerks, IComputedSkills} from "./computed";

export * from './activity'
export * from './ascension_perk'
export * from './computed'
export * from './player'
export * from './potential'
export * from './skill'
export * from './startup'
export * from './translation'
export * from './ui'

export interface IGameState {
   startup: string

   turns: number
   player?: IPlayerStatus

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

export interface IResponseFail<R> {
   success: false
   message: ITranslationKey
}

export type IResponse<R> = IResponseSuccess<R> | IResponseFail<R>

import { ITranslationKey } from './translation'
import { IPartialPlayerAttributes } from './player'

export interface IActivityOutput {
   attributes?: IPartialPlayerAttributes
   skillPoints?: number
   mentalHealth?: number
   satisfactory?: number
   money?: number
}

export interface IActivity {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   category: string
   level: number
   output?: IActivityOutput
}

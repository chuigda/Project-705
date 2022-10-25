import {ITranslationKey} from './translation'
import {IBuiltinPropertyId} from "./player";

export interface IStartup {
   ident: string,
   name: ITranslationKey,
   description: ITranslationKey,

   player?: Record<IBuiltinPropertyId, number>
}

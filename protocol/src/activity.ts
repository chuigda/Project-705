import { ITranslationKey } from './translation'
import { IPropertyId } from './player'

export interface IActivity {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   category: string
   level: number
   output?: Record<IPropertyId, number>
}

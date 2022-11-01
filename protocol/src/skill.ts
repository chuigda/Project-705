import { ITranslationKey } from './translation'
import { IPlayerProperty, IPropertyId } from './player'

export interface ISkillCost {
   base: number
   properties?: Record<IPropertyId, number>
}

export interface ISkill {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   category?: string
   cost: ISkillCost
   output?: Record<IPropertyId, number>
   activities?: string[]
}

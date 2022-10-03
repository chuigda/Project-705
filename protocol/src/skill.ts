import { ITranslationKey } from './translation'
import { IPartialPlayerAttributes } from './player'

export interface ISkillCost {
   base: number
   attributes?: IPartialPlayerAttributes
}

export interface ISkillOutput {
   attributes: IPartialPlayerAttributes
}

export interface ISkill {
   ident: string
   name: ITranslationKey
   description: ITranslationKey

   category?: string
   cost: ISkillCost
   output?: ISkillOutput
   activities?: string[]
}

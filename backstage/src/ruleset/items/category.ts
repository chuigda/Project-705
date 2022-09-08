import { MaybeTranslationKey } from '@app/base/uid'

export type SkillCategoryId = string

export type ActivityCategoryId = string

export interface SkillCategory {
   readonly ident: SkillCategoryId
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey
}

import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'

export type PatchMode = 'overwrite' | 'and' | 'or'

export interface ItemBase {
   readonly ident: Ident
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey
   readonly patch?: PatchMode
   readonly scope?: Scope
}

export interface PlayerAttributesUpdate {
   strength?: number
   intelligence?: number
   emotionalIntelligence?: number
   memorization?: number
   imagination?: number
   charisma?: number
}

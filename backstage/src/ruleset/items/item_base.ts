import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'

/// 暂未使用
export type PatchMode = 'overwrite' | 'and' | 'or'

export interface ItemBase {
   readonly ident: Ident
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey
   readonly patch?: PatchMode
   readonly scope?: Scope
}

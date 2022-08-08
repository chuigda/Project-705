import { Ident, MaybeTranslationKey, Scope } from '../../base/uid'

export type PatchMode = 'overwrite' | 'and' | 'or'

export class ItemBase {
   readonly ident: Ident
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey
   readonly patch?: PatchMode
   readonly scope?: Scope

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,
      scope?: Scope,
      patch?: PatchMode,
   ) {
      this.ident = ident
      this.name = name
      this.description = description

      this.patch = patch
      this.scope = scope
   }
}

import { Ident, MaybeTranslationKey } from '../../base/uid'

export class ItemBase {
   readonly ident: Ident
   readonly name: MaybeTranslationKey
   readonly description: MaybeTranslationKey

   constructor(ident: Ident, name: MaybeTranslationKey, description: MaybeTranslationKey) {
      this.ident = ident
      this.name = name
      this.description = description
   }
}

export interface IPatchable {
   readonly patchMode?: 'overwrite' | 'and' | 'or'
}

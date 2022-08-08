import { ItemBase, PatchMode } from '@app/ruleset/items/item_base'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'

export class AscensionPerk extends ItemBase {
   readonly potential?: PotentialExpression[]
   readonly modifier?: object
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      opt?: {
         potential?: PotentialExpression[],
         modifier?: object,
         events?: MaybeInlineEvent[],

         scope?: Scope,
         patch?: PatchMode
      }
   ) {
      super(ident, name, description, opt?.scope, opt?.patch)

      if (opt) {
         this.potential = opt.potential
         this.modifier = opt.modifier
         this.events = opt.events
      }
   }
}

import { ItemBase } from './item_base'
import { PotentialExpression } from './potential'
import { MaybeInlineEvent } from './event'
import { Ident, MaybeTranslationKey } from '../../base/uid'

export class AscensionPerk extends ItemBase {
   readonly potential?: PotentialExpression[]
   readonly modifier?: object
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      optionalArgs?: {
         potential?: PotentialExpression[],
         modifier?: object,
         events?: MaybeInlineEvent[]
      }
   ) {
      super(ident, name, description)

      if (optionalArgs) {
         this.potential = optionalArgs.potential
         this.modifier = optionalArgs.modifier
         this.events = optionalArgs.events
      }
   }
}

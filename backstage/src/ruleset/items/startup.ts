import { PlayerAttributes } from '@app/executor/game_context'
import { ItemBase, PatchMode } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'

export class StartupPlayerProperties {
   readonly attributes?: PlayerAttributes
   readonly talent?: PlayerAttributes
   readonly skillPoints?: number
   readonly money?: number
   readonly moneyPerTurn?: number

   constructor(
      optionalArgs?: {
         attributes?: PlayerAttributes
         talent?: PlayerAttributes
         skillPoints?: number
         money?: number
         moneyPerTurn?: number
      }
   ) {
      if (optionalArgs) {
         this.attributes = optionalArgs.attributes
         this.talent = optionalArgs.attributes
         this.skillPoints = optionalArgs.skillPoints
         this.money = optionalArgs.money
         this.moneyPerTurn = optionalArgs.moneyPerTurn
      }
   }
}

export class Startup extends ItemBase {
   readonly player?: StartupPlayerProperties
   readonly events?: MaybeInlineEvent[]
   readonly modifier?: object

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      opt?: {
         player?: StartupPlayerProperties,
         events?: MaybeInlineEvent[],
         modifier?: object,

         scope?: Scope,
         patch?: PatchMode
      }
   ) {
      super(ident, name, description, opt?.scope, opt?.patch)

      if (opt) {
         this.player = opt.player
         this.events = opt.events
         this.modifier = opt.modifier
      }
   }
}

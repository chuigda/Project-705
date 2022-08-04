import { PlayerAttributes } from '../../executor/game_context'
import { ItemBase } from './item_base'
import { MaybeInlineEvent } from './event'
import { Ident, MaybeTranslationKey } from '../../base/uid'

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

      optionalArgs?: {
         player?: StartupPlayerProperties,
         events?: MaybeInlineEvent[],
         modifier?: object
      }
   ) {
      super(ident, name, description)

      if (optionalArgs) {
         this.player = optionalArgs.player
         this.events = optionalArgs.events
         this.modifier = optionalArgs.modifier
      }
   }
}

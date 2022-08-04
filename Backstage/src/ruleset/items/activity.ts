import { ItemBase } from './item_base'
import { PlayerAttributes } from '../../executor/game_context'
import { MaybeInlineEvent } from './event'
import { Ident, MaybeTranslationKey } from '../../base/uid'

export class ActivityOutput {
   readonly attributes?: PlayerAttributes
   readonly skillPoints?: number
   readonly pressure?: number
   readonly satisfactory?: number
   readonly money?: number

   constructor(
      optionalArgs: {
         attributes?: PlayerAttributes,
         skillPoints?: number,
         pressure?: number,
         satisfactory?: number,
         money?: number
      }
   ) {
      this.attributes = optionalArgs.attributes
      this.skillPoints = optionalArgs.skillPoints
      this.pressure = optionalArgs.pressure
      this.satisfactory = optionalArgs.satisfactory
      this.money = optionalArgs.money
   }
}

export class Activity extends ItemBase {
   readonly category: string
   readonly level: number
   readonly output?: ActivityOutput
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      category: string,
      level: number,

      optionalArgs?: {
         output?: ActivityOutput,
         events?: MaybeInlineEvent[]
      }
   ) {
      super(ident, name, description)

      this.category = category
      this.level = level

      if (optionalArgs) {
         this.output = optionalArgs.output
         this.events = optionalArgs.events
      }
   }
}

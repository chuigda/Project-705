import { ItemBase, PatchMode } from './item_base'
import { PlayerAttributes } from '../../executor/game_context'
import { MaybeInlineEvent } from './event'
import { Ident, MaybeTranslationKey, Scope } from '../../base/uid'

export class ActivityOutput {
   readonly attributes?: PlayerAttributes
   readonly skillPoints?: number
   readonly pressure?: number
   readonly satisfactory?: number
   readonly money?: number

   constructor(
      opt: {
         attributes?: PlayerAttributes,
         skillPoints?: number,
         pressure?: number,
         satisfactory?: number,
         money?: number
      }
   ) {
      this.attributes = opt.attributes
      this.skillPoints = opt.skillPoints
      this.pressure = opt.pressure
      this.satisfactory = opt.satisfactory
      this.money = opt.money
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

      opt?: {
         output?: ActivityOutput,
         events?: MaybeInlineEvent[],

         scope?: Scope,
         patch?: PatchMode
      }
   ) {
      super(ident, name, description, opt.scope, opt.patch)

      this.category = category
      this.level = level

      if (opt) {
         this.output = opt.output
         this.events = opt.events
      }
   }
}

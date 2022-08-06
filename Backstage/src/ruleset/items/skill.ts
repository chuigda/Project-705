import { PotentialExpression } from './potential'
import { Ident, MaybeTranslationKey, Scope } from '../../base/uid'
import { PlayerAttributes } from '../../executor/game_context'
import { ItemBase, PatchMode } from './item_base'
import { MaybeInlineEvent } from './event'

export type SkillPotential = PotentialExpression | Ident

export class SkillCost {
   readonly base: number
   readonly attributes?: PlayerAttributes

   constructor(base: number, attributes?: PlayerAttributes) {
      this.base = base
      this.attributes = attributes
   }
}

export class SkillOutput {
   readonly attributes?: PlayerAttributes

   constructor(attributes?: PlayerAttributes) {
      this.attributes = attributes
   }
}

export class Skill extends ItemBase {
   readonly category?: string
   readonly potential?: SkillPotential[]
   readonly cost: SkillCost
   readonly output?: SkillOutput
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      cost: SkillCost,

      opt?: {
         category?: string,
         potential?: SkillPotential[],
         output?: SkillOutput,
         activities?: Ident[],
         events?: MaybeInlineEvent[],

         scope?: Scope,
         patch?: PatchMode
      }
   ) {
      super(ident, name, description, opt.scope, opt.patch)

      this.cost = cost

      if (opt) {
         this.category = opt.category
         this.potential = opt.potential
         this.output = opt.output
         this.activities = opt.activities
         this.events = opt.events
      }
   }
}

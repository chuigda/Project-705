import { PotentialExpression } from '@app/ruleset/items/potential'
import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'
import { PlayerAttributes } from '@app/executor/game_context'
import { ItemBase, PatchMode } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

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
      super(ident, name, description, opt?.scope, opt?.patch)

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

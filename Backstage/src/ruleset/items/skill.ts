import { PotentialExpression } from './potential'
import { Ident, MaybeTranslationKey } from '../../base/uid'
import { PlayerAttributes } from '../../executor/game_context'
import { ItemBase } from './item_base'
import { MaybeInlineEvent } from './event'

export type SkillPotentialExpression = PotentialExpression | Ident

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
   readonly potential?: SkillPotentialExpression[]
   readonly cost: SkillCost
   readonly output?: SkillOutput
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]

   constructor(
      ident: Ident,
      name: MaybeTranslationKey,
      description: MaybeTranslationKey,

      cost: SkillCost,

      optionalArgs?: {
         category?: string,
         potential?: SkillPotentialExpression[],
         output?: SkillOutput,
         activities?: Ident[],
         events?: MaybeInlineEvent[]
      }
   ) {
      super(ident, name, description)

      this.cost = cost

      if (optionalArgs) {
         this.category = optionalArgs.category
         this.potential = optionalArgs.potential
         this.output = optionalArgs.output
         this.activities = optionalArgs.activities
         this.events = optionalArgs.events
      }
   }
}

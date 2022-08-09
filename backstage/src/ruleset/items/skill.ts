import { PotentialExpression } from '@app/ruleset/items/potential'
import { Ident } from '@app/base/uid'
import { ItemBase, PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export type SkillPotential = PotentialExpression | Ident

export class SkillCost {
   readonly base: number
   readonly attributes?: PlayerAttributesUpdate
}

export class SkillOutput {
   readonly attributes?: PlayerAttributesUpdate
}

export class Skill extends ItemBase {
   readonly category?: string
   readonly potential?: SkillPotential[]
   readonly cost: SkillCost
   readonly output?: SkillOutput
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]
}

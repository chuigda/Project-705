import { PotentialExpression } from '@app/ruleset/items/potential'
import { Ident } from '@app/base/uid'
import { ItemBase, PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { SkillCategoryId } from '@app/ruleset'

export type SkillPotential = PotentialExpression | Ident

export interface SkillCost {
   readonly base: number
   readonly attributes?: PlayerAttributesUpdate
}

export interface SkillOutput {
   readonly attributes: PlayerAttributesUpdate
}

export interface Skill extends ItemBase {
   readonly category?: SkillCategoryId
   readonly potential?: SkillPotential[]
   readonly cost: SkillCost
   readonly output?: SkillOutput
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]
}

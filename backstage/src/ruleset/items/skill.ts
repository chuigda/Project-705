import { PotentialExpression } from '@app/ruleset/items/potential'
import { Ident } from '@app/base/uid'
import { ItemBase } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { SkillCategoryId } from '@app/ruleset'
import { PropertyId } from '@app/executor/game_context/player'

export type SkillPotential = PotentialExpression | Ident

export interface SkillCost {
   readonly base: number
   readonly properties?: Record<PropertyId, number>
}

export interface Skill extends ItemBase {
   readonly category?: SkillCategoryId
   readonly potential?: SkillPotential[]
   readonly cost: SkillCost
   readonly output?: Record<PropertyId, number>
   readonly activities?: Ident[]
   readonly events?: MaybeInlineEvent[]
}

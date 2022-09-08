import { ItemBase } from '@app/ruleset/items/item_base'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export interface AscensionPerk extends ItemBase {
   readonly potential?: PotentialExpression[]
   readonly modifier?: object
   readonly events?: MaybeInlineEvent[]
}

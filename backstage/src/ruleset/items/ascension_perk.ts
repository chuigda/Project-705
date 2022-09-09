import { ItemBase } from '@app/ruleset/items/item_base'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { Ident } from '@app/base/uid'

export interface AscensionPerk extends ItemBase {
   readonly potential?: PotentialExpression[]
   readonly modifier?: Ident
   readonly events?: MaybeInlineEvent[]
}

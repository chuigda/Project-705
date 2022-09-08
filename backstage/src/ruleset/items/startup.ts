import { ItemBase, PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { Ident } from '@app/base/uid'

export interface StartupPlayerProperties {
   readonly attributes?: PlayerAttributesUpdate
   readonly talent?: PlayerAttributesUpdate
   readonly skillPoints?: number
   readonly money?: number
   readonly moneyPerTurn?: number
}

export interface Startup extends ItemBase {
   readonly player?: StartupPlayerProperties
   readonly events?: MaybeInlineEvent[]
   readonly modifier?: Ident
}

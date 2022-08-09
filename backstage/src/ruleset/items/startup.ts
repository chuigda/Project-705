import { ItemBase, PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export class StartupPlayerProperties {
   readonly attributes?: PlayerAttributesUpdate
   readonly talent?: PlayerAttributesUpdate
   readonly skillPoints?: number
   readonly money?: number
   readonly moneyPerTurn?: number
}

export class Startup extends ItemBase {
   readonly player?: StartupPlayerProperties
   readonly events?: MaybeInlineEvent[]
   readonly modifier?: object
}

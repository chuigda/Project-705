import { ItemBase, PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export interface ActivityOutput {
   readonly attributes?: PlayerAttributesUpdate
   readonly skillPoints?: number
   readonly mentalHealth?: number
   readonly satisfactory?: number
   readonly money?: number
}

export interface Activity extends ItemBase {
   readonly category: string
   readonly level: number
   readonly energyCost: number
   readonly output?: ActivityOutput
   readonly events?: MaybeInlineEvent[]
}

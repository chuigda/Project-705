import { ItemBase } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { PropertyId } from '@app/executor/game_context/player'

export interface Activity extends ItemBase {
   readonly category: string
   readonly level: number
   readonly energyCost: number
   readonly output?: Record<PropertyId, number>
   readonly events?: MaybeInlineEvent[]
}

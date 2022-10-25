import { ItemBase } from '@app/ruleset/items/item_base'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { PlayerProperty, PropertyId } from '@app/executor/game_context'

export type StartupPlayerProperties = Record<PropertyId, PlayerProperty>

export interface Startup extends ItemBase {
   readonly events?: MaybeInlineEvent[]
}

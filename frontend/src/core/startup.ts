import { GameContext } from '@app/core/game_context'
import { Startup } from '@app/core/ruleset'
import { triggerEventSeries } from '@app/core/events'

export function applyStartup(gameContext: GameContext, startup: Startup) {
   triggerEventSeries(gameContext, startup.events, startup.scope)
}

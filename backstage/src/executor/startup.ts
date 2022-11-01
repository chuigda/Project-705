import { GameContext } from '@app/executor/game_context'
import { Startup } from '@app/ruleset'
import { triggerEventSeries } from '@app/executor/events'

export function applyStartup(gameContext: GameContext, startup: Startup) {
   triggerEventSeries(gameContext, startup.events, startup.scope)
}

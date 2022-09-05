import { GameContext } from '@app/executor/game_context'
import { triggerEvent } from '@app/executor/events'
import ruleSet from '@app/server/ruleset'
import { applyStartup } from '@app/executor/startup'

class ServerStore {
   gameContexts: Record<string, GameContext> = {}

   initGame(accessToken: string, startupId: string): GameContext | undefined {
      const startup = ruleSet.startups[startupId]
      if (!startup) {
         return undefined
      }

      const context = new GameContext(ruleSet)
      applyStartup(context, startup)
      for (const event of ruleSet.onRuleSetLoaded) {
         triggerEvent(context, event)
      }

      this.gameContexts[accessToken] = context
      return context
   }

   getGame(accessToken: string): GameContext | undefined {
      return this.gameContexts[accessToken]
   }
}

const serverStore = new ServerStore()

export default serverStore

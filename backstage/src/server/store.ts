import { GameContext } from '@app/executor/game_context'
import ruleSet from '@app/server/ruleset'
import initGame from '@app/loader/init'

class ServerStore {
   gameContexts: Record<string, GameContext> = {}

   initGame(accessToken: string, startupId: string): GameContext | undefined {
      const context = initGame(ruleSet, startupId)
      if (!context) {
         console.error('[E] [ServerStore.initGame] error initializing game context')
         return undefined
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

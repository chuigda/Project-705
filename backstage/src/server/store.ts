import { GameContext } from '@app/executor/game_context'
import { v4 as uuid } from 'uuid'
import { CompiledRuleSet, load } from '@app/loader'
import { triggerEvent } from '@app/executor/events'

const ruleSet: CompiledRuleSet = load()

class ServerStore {
   gameContexts: Record<string, GameContext> = {}

   initGame(accessToken?: string): GameContext {
      if (!accessToken) {
         accessToken = uuid()
      }

      let context = this.gameContexts[accessToken]
      if (context) {
         return context
      }

      context = new GameContext(ruleSet)
      for (const event of ruleSet.onRuleSetLoaded) {
         triggerEvent(context, event)
      }

      return context
   }
}

const serverStore = new ServerStore()

export default serverStore

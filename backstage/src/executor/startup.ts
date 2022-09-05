import { GameContext, PlayerAttributes } from '@app/executor/game_context'
import { Startup } from '@app/ruleset'
import { PlayerAttributesUpdate } from '@app/ruleset/items/item_base'
import { popScope, pushScope, triggerEvent } from '@app/executor/events'

export function applyStartup(gameContext: GameContext, startup: Startup) {
   if (startup.player) {
      const { attributes, talent, skillPoints, money, moneyPerTurn } = startup.player
      if (attributes) {
         for (const attrName in attributes) {
            const attrValue = attributes[<keyof PlayerAttributesUpdate>attrName]
            if (attrValue) {
               gameContext.state.player.attributes[<keyof PlayerAttributes>attrName] = attrValue
            }
         }
      }

      if (talent) {
         for (const talentName in talent) {
            const talentValue = talent[<keyof PlayerAttributesUpdate>talentName]
            if (talentValue) {
               gameContext.state.player.talent[<keyof PlayerAttributes>talentName] = talentValue
            }
         }
      }

      if (skillPoints) {
         gameContext.state.player.skillPoints = skillPoints
      }

      if (money) {
         gameContext.state.player.money = money
      }

      if (moneyPerTurn) {
         gameContext.state.player.moneyPerTurn = moneyPerTurn
      }
   }

   if (startup.events) {
      if (startup.scope) {
         pushScope(gameContext, startup.scope)
      }

      for (const event of startup.events) {
         triggerEvent(gameContext, event)
      }

      if (startup.scope) {
         popScope(gameContext)
      }
   }
}

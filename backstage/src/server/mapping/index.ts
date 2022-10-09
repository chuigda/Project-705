import { GameState, UpdateTracker } from '@app/executor/game_context'
import { IGameState } from '@protocol/index'

import { sendMap } from '@app/server/mapping/map_site'
import { sendComputedAscensionPerks, sendComputedSkills } from '@app/server/mapping/computed'
import { sendPlayerStatus } from '@app/server/mapping/player'
import { sendShopStatus } from '@app/server/mapping/shop'

export { sendStartup } from '@app/server/mapping/startup'

export function sendGameState(gs: GameState, updateTracker?: UpdateTracker): IGameState {
   if (!updateTracker) {
      return {
         startup: gs.startup,
         turns: gs.turns,
         player: sendPlayerStatus(gs.player, undefined),
         shop: sendShopStatus(gs.shop),

         modifiers: [...gs.modifiers],
         variables: gs.variables,

         map: sendMap(gs.map),

         // TODO(chuigda): transpile ComputedModifier
         // computedModifiers: gs.computedModifier,
         computedSkills: sendComputedSkills(gs.computedSkills!),
         computedAscensionPerks: sendComputedAscensionPerks(gs.computedAscensionPerks!)

         // TODO(chuigda): transpile custom UI items
      }
   } else {
      return {
         startup: gs.startup,
         turns: gs.turns,
         player: updateTracker.player.any() ? sendPlayerStatus(gs.player, updateTracker.player) : undefined,
         shop: updateTracker.shop ? sendShopStatus(gs.shop) : undefined,

         modifiers: updateTracker.modifiers ? [...gs.modifiers] : undefined,
         variables: updateTracker.variables ? gs.variables : undefined,

         map: updateTracker.map ? sendMap(gs.map) : undefined,

         // computedModifiers: updateTracker.computedModifiers ? gs.computedModifier : undefined,
         computedSkills: updateTracker.computedSkills ? sendComputedSkills(gs.computedSkills!) : undefined,
         computedAscensionPerks: updateTracker.computedAscensionPerks
            ? sendComputedAscensionPerks(gs.computedAscensionPerks!)
            : undefined
      }
   }
}

import { GameState, UpdateTracker } from '@app/executor/game_context'
import { IGameState } from '@protocol/index'

import { sendComputedAscensionPerks, sendComputedSkills } from './computed'
import { sendPlayerStatus } from './player'

export { sendStartup } from './startup'

export function sendGameState(gs: GameState, updateTracker?: UpdateTracker): IGameState {
   if (!updateTracker) {
      return {
         startup: gs.startup,
         turns: gs.turns,
         player: sendPlayerStatus(gs.player, undefined),

         modifiers: [...gs.modifiers],
         variables: gs.variables,

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

         modifiers: updateTracker.modifiers ? [...gs.modifiers] : undefined,
         variables: updateTracker.variables ? gs.variables : undefined,

         // computedModifiers: updateTracker.computedModifiers ? gs.computedModifier : undefined,
         computedSkills: updateTracker.computedSkills ? sendComputedSkills(gs.computedSkills!) : undefined,
         computedAscensionPerks: updateTracker.computedAscensionPerks
            ? sendComputedAscensionPerks(gs.computedAscensionPerks!)
            : undefined
      }
   }
}

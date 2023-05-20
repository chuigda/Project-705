import { GameContext } from '@app/core/game_context'
import { Ident, mAscensionPerkId } from '@app/core/base/uid'
import { ensureScope } from '@app/core/game_context/scope'
import { triggerEventSeries } from '@app/core/events'
import { addModifier } from '@app/core/modifier'

export function addAscensionPerkSlot(gameContext: GameContext, count: number): void {
   gameContext.state.player.ascensionPerkSlots += count
}

export function activateAscensionPerk(gameContext: GameContext, ascensionPerk: Ident, force?: boolean): void {
   const scope = ensureScope(gameContext)
   const ascensionPerkId = mAscensionPerkId(scope, ascensionPerk)
   let apContent
   if (force) {
      apContent = gameContext.ruleSet.ascensionPerks[ascensionPerkId]
      if (!apContent) {
         throw new Error(`[E] [activateAscensionPerk] 飞升 '${ascensionPerkId}' 不存在`)
      }
   } else {
      apContent = gameContext.state.computedAscensionPerks!.available[ascensionPerkId]
      if (!apContent) {
         throw new Error(`[E] [activateAscensionPerk] 飞升 '${ascensionPerkId}' 当前不可用`)
      }
   }

   console.info(`[I] [activateAscensionPerk] 激活飞升项目 '${ascensionPerkId}'`)

   if (gameContext.state.player.ascensionPerks[ascensionPerkId]) {
      console.warn(`[W] [activateAscensionPerk] 飞升项目 '${ascensionPerkId}' 已经激活，重新激活将会重新执行其事件脚本`)
   }

   const { scope: apScope, events } = apContent
   delete gameContext.state.computedAscensionPerks!.available[ascensionPerkId]

   delete gameContext.ascensionPerkPool[ascensionPerkId]
   gameContext.state.player.ascensionPerks[ascensionPerkId] = apContent

   if (apContent.modifier) {
      addModifier(gameContext, apContent.modifier)
   }

   triggerEventSeries(gameContext, events, apScope)
}

const ascensionPerkFunctions = {
   addAscensionPerkSlot,
   activateAscensionPerk
}

export default ascensionPerkFunctions

import { computePotentialAscensionPerks, computePotentialSkills } from '@app/executor/compute'
import { triggerEvent } from '@app/executor/events'
import { GameContext } from '@app/executor/game_context'
import serverStore from '@app/server/store'

export default function epNextTurn(accessToken?: string): GameContext | undefined {
   if (!accessToken) return undefined
   const context = serverStore.getGame(accessToken)
   if (!context) return undefined
   context.state.events.turnOver.forEach((eid) => triggerEvent(context, eid))
   context.state.turns += 1
   // todo: 计算静态修正
   computePotentialSkills(context)
   context.recomputeSkillCosts()
   computePotentialAscensionPerks(context)
   context.state.events.turnStart.forEach((eid) => triggerEvent(context, eid))
   return context
}

import { computePotentialAscensionPerks, computePotentialSkills } from '@app/executor/compute'
import { triggerEvent } from '@app/executor/events'
import { GameContext } from '@app/executor/game_context'
import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { sendGameState } from '@app/server/mapping'

export default function epNextTurn(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   gameContext.updateTracker.reset()

   gameContext.state.events.turnOver.forEach(event => triggerEvent(gameContext, event))
   gameContext.state.turns += 1
   computePotentialSkills(gameContext)
   computePotentialAscensionPerks(gameContext)
   gameContext.state.events.turnStart.forEach(event => triggerEvent(gameContext, event))

   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

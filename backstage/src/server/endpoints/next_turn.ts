import { GameContext } from '@app/core/game_context'
import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { sendGameState } from '@app/server/mapping'
import { nextTurn } from '@app/core/turn'

export default function epNextTurn(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   gameContext.updateTracker.reset()

   nextTurn(gameContext)

   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

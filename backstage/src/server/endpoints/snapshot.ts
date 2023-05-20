import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { GameContext } from '@app/core/game_context'
import { sendGameState } from '@app/server/mapping'

export default function epSendSnapshot(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   res.json({
      success: true,
      message: 'success',
      result: sendGameState(res.locals.gameContext.state)
   })
}

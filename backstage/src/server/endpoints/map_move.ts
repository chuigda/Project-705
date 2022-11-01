import { GameContext } from '@app/executor/game_context'
import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { sendGameState } from '@app/server/mapping'
import { choosePath } from '@app/executor/map_site'

export default function epMapMove(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
): void {
   const { gameContext } = res.locals

   const { direction } = req.body
   if (direction !== 'left' || direction !== 'right') {
      res.status(400).json({
         success: false,
         message: 'missing or invalid direction'
      })
      return
   }

   gameContext.updateTracker.reset()
   choosePath(gameContext, direction)
   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

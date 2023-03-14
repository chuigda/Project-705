import { GameContext } from '@app/executor/game_context'
import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { learnSkill } from '@app/executor/skill'
import { sendGameState } from '@app/server/mapping'

export default function epLearnSkill(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
): void {
   const { gameContext } = res.locals

   const { skillId } = req.body
   if (!skillId || typeof skillId !== 'string') {
      res.status(400).json({
         success: false,
         message: 'missing skillId'
      })
      return
   }

   gameContext.updateTracker.reset()
   learnSkill(gameContext, skillId)
   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

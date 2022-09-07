import { Request, Response } from 'express'
import { IGameState, IResponse } from '@protocol/index'
import { GameContext } from '@app/executor/game_context'
import { activateAscensionPerk } from '@app/executor/ascension_perk'
import { sendGameState } from '@app/server/mapping'

export default function epActivateAscensionPerk(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals

   const { ascensionPerkId } = req.body
   if (!ascensionPerkId || typeof ascensionPerkId !== 'string') {
      res.status(400).json({
         success: false,
         message: 'missing ascensionPerkId'
      })
      return
   }

   gameContext.updateTracker.reset()
   activateAscensionPerk(gameContext, ascensionPerkId)
   res.json({
      success: true,
      message: 'success',
      result: sendGameState(gameContext.state, gameContext.updateTracker)
   })
}

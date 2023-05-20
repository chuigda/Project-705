import { GameContext } from '@app/core/game_context'
import serverStore from '@app/server/store'
import { Request, Response } from 'express'
import { IResponse } from '@protocol/index'

export default function epInitGame(
   req: Request,
   res: Response<IResponse<void>, { accessToken: string }>
): void {
   const { startupId } = req.body
   if (!startupId || typeof startupId !== 'string') {
      res.status(400).json({
         success: false,
         message: 'missing startupId'
      })
      return
   }

   const gameContext: GameContext | undefined = serverStore.initGame(res.locals.accessToken, startupId)
   if (!gameContext) {
      res.status(400).json({
         success: false,
         message: 'wrong startupId'
      })
      return
   }

   res.json({
      success: true,
      message: 'success',
      result: undefined
   })
}

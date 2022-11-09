import { Request, Response } from 'express'
import { IGameState, IResponse, ISimpleDialog } from '@protocol/index'
import { GameContext } from '@app/executor/game_context'
import { sendSimpleDialog } from '@app/server/mapping/ui'
import { closeBubbleMessage, destroyDialog, useDialogOption } from '@app/executor/ui'
import { sendGameState } from '@app/server/mapping'

export function epGetDialog(
   req: Request,
   res: Response<IResponse<ISimpleDialog>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { dialogId } = req.query

   const dialog = gameContext.state.dialogs[<string>dialogId]
   if (!dialog) {
      console.error(`[E] [epGetDialog] dialog '${dialogId}' does not exist`)
      res.json({
         success: false,
         message: 'dialog not found'
      })
      return
   }

   res.json({
      success: true,
      message: 'success',
      result: sendSimpleDialog(dialog)
   })
}

export function epUseDialogOption(
   req: Request,
   res: Response<IResponse<IGameState>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { dialogId, optionKey } = req.body

   gameContext.updateTracker.reset()
   const [success, message] = useDialogOption(gameContext, dialogId, optionKey)
   if (!success) {
      res.json({ success, message: message || 'error' })
      return
   }

   res.json({
      success,
      message: message || 'success',
      result: sendGameState(gameContext.state)
   })
}

export function epDestroyDialog(
   req: Request,
   res: Response<IResponse<undefined>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { dialogId } = req.body

   const [success, message] = destroyDialog(gameContext, dialogId)
   if (!success) {
      res.json({ success, message: message || 'error' })
      return
   }

   res.json({
      success,
      message: message || 'success',
      result: undefined
   })
}

export function epCloseBubbleMessage(
   req: Request,
   res: Response<IResponse<undefined>, { gameContext: GameContext }>
) {
   const { gameContext } = res.locals
   const { uid } = req.body

   const [success, message] = closeBubbleMessage(gameContext, uid)
   if (!success) {
      res.json({ success, message: message || 'error' })
      return
   }

   res.json({
      success,
      message: message || 'success',
      result: undefined
   })
}

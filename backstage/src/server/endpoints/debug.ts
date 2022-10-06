import express = require('express')
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { IGameState, IResponse } from '@protocol/index'
import { validateBody } from '@app/util/type_assert_validate'
import { GameContext } from '@app/executor/game_context'
import { addActivity } from '@app/executor/activity'
import { sendGameState } from '@app/server/mapping'
import { activateAscensionPerk } from '@app/executor/ascension_perk'
import { grantSkill } from '@app/executor/skill'
import { nextTurn } from '@app/executor/turn'
import { addModifier, removeModifier } from '@app/executor/modifier'
import { abort } from '@app/util/emergency'

const authToken = uuid()
console.info(`[I] [debug.ts] debugging interface uuid = '${authToken}'`)

const debugRouter = express.Router()

debugRouter.use((req: Request, res: Response<IResponse<any>>, next) => {
   const token = req.headers['X-Debugger-Auth-Token']
   if (token !== authToken) {
      res.json({
         success: false,
         message: 'unauthenticated access to debugging console'
      })
      return
   }

   next()
})

function ensureMessage(success: boolean, message?: string): string {
   return message || (success ? 'success' : 'error')
}

type DebugResponse = Response<IResponse<IGameState>, { gameContext: GameContext }>

debugRouter.post(
   '/add_activity',
   validateBody({ activityId: 'string' }),
   (req, res: DebugResponse) => {
      const { activityId } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = addActivity(gameContext, activityId)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/activate_ascension_perk',
   validateBody({ ascensionPerkId: 'string', force: 'boolean?' }),
   (req, res: DebugResponse) => {
      const { ascensionPerkId, force } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = activateAscensionPerk(gameContext, ascensionPerkId, force)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/research_technology',
   validateBody({ techId: 'string', force: 'boolean?' }),
   (req, res: DebugResponse) => {
      const { techId, force } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = grantSkill(gameContext, techId, force)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/next_turn',
   (req, res: DebugResponse) => {
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = nextTurn(gameContext)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/add_modifier',
   validateBody({ modifierId: 'string' }),
   (req, res: DebugResponse) => {
      const { modifierId } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = addModifier(gameContext, modifierId)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/remove_modifier',
   validateBody({ modifierId: 'string' }),
   (req, res: DebugResponse) => {
      const { modifierId } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = removeModifier(gameContext, modifierId)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/crash',
   (req, res: DebugResponse) => {
      console.error('[E] [api /api/debug/crash] server will crash in 5 seconds')
      res.status(500).json({
         success: false,
         message: 'manual crash via debugging interface'
      })
      setTimeout(abort, 5000)
   }
)

export default debugRouter

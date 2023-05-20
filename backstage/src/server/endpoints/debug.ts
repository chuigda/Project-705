import express = require('express')
import { Response } from 'express'
import { IGameState, IResponse, IResponseFail } from '@protocol/index'
import { GameContext } from '@app/core/game_context'
import { addActivity } from '@app/core/activity'
import { triggerEvent } from '@app/core/events'
import { sendGameState } from '@app/server/mapping'
import { activateAscensionPerk } from '@app/core/ascension_perk'
import { grantSkill } from '@app/core/skill'
import { nextTurn } from '@app/core/turn'
import { addModifier, removeModifier } from '@app/core/modifier'
import { abort } from '@app/util/emergency'
import { validateAccessToken, validateBody, validateGameContext } from '@app/server/middleware'

import serverStore from '@app/server/store'
import { updateProperty } from '@app/core/property'
import { initMap } from '@app/core/map_site'

const debugRouter = express.Router()

function ensureMessage(success: boolean, message?: string): string {
   return message || (success ? 'success' : 'error')
}

type DebugResponse = Response<IResponse<IGameState>, { gameContext: GameContext }>

debugRouter.post(
   '/init',
   validateAccessToken,
   validateBody({ startupId: 'string' }),
   (req, res: Response<IResponse<IGameState>, { accessToken: string }>) => {
      const { startupId } = req.body
      const { accessToken } = res.locals
      const gameContext: GameContext | undefined = serverStore.initGame(accessToken, startupId)
      if (!gameContext) {
         res.json({
            success: false,
            message: 'wrong startupId'
         })
         return
      }

      res.json({
         success: true,
         message: 'success',
         result: sendGameState(gameContext.state)
      })
   }
)

debugRouter.post(
   '/add_activity',
   validateGameContext,
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
   validateGameContext,
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
   validateGameContext,
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
   validateGameContext,
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
   validateGameContext,
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
   validateGameContext,
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
   '/property',
   validateGameContext,
   validateBody({
      property: 'string',
      op: 'string',
      value: 'number'
   }),
   (req, res: DebugResponse) => {
      const { property, op, value } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      const [success, message] = updateProperty(gameContext, property, op, value)
      res.json({
         success,
         message: ensureMessage(success, message),
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/trigger_event',
   validateGameContext,
   validateBody({ event: 'string', args: 'object' }),
   (req, res: DebugResponse) => {
      const { event, args } = req.body
      const { gameContext } = res.locals
      gameContext.updateTracker.reset()
      triggerEvent(gameContext, event, args)
      res.json({
         success: true,
         message: 'success',
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/regen_map',
   validateGameContext,
   (req, res: DebugResponse) => {
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      initMap(gameContext)
      res.json({
         success: true,
         message: 'success',
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/map_fast_foward',
   validateGameContext,
   validateBody({
      paths: [(<any>'string').chainWith((x: any) => x === 'left' || x === 'right')]
   }),
   (req, res: DebugResponse) => {
      const { paths } = req.body
      const { gameContext } = res.locals

      gameContext.updateTracker.reset()
      // initMap(gameContext)
      // TODO(rebuild)
      res.status(501).json({
         success: false,
         message: 'not implemented',
         // result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)

debugRouter.post(
   '/crash',
   (req, res: Response<IResponseFail>) => {
      console.error('[E] [api /api/debug/crash] server will crash in 5 seconds')
      res.status(500).json({
         success: false,
         message: 'MANUAL_CRASH'
      })
      setTimeout(abort, 5000)
   }
)

export default debugRouter

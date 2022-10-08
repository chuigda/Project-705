import express = require('express')
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { IGameState, IResponse, IResponseFail } from '@protocol/index'
import { GameContext } from '@app/executor/game_context'
import { addActivity } from '@app/executor/activity'
import { triggerEvent } from '@app/executor/events';
import { sendGameState } from '@app/server/mapping'
import { activateAscensionPerk } from '@app/executor/ascension_perk'
import { grantSkill } from '@app/executor/skill'
import { nextTurn } from '@app/executor/turn'
import { addModifier, removeModifier } from '@app/executor/modifier'
import { abort } from '@app/util/emergency'
import { validateAccessToken, validateBody, validateGameContext } from '@app/server/middleware'

import serverStore from '@app/server/store'
import { updatePlayerProperty } from '@app/executor/properties'


const authToken = uuid()
console.info(`[I] [debug.ts] debugging interface uuid = '${authToken}'`)

const debugRouter = express.Router()

debugRouter.use((req: Request, res: Response<IResponse<any>>, next) => {
   const token = req.header('X-Debugger-Auth-Token')
   if (token !== authToken) {
      console.warn(`[W] [api /api/debug] wrong token '${token}', expected '${authToken}'`)
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
   '/add_attribute',
   validateGameContext,
   validateBody({ attrName: 'string', value: 'number' }),
   (req, res: DebugResponse) => {
      const { attrName, value } = req.body
      const { gameContext } = res.locals

      let propertyPath
      switch (attrName) {
         case 'strength':
         case 'str':
            propertyPath = 'attributes.strength'
            break
         case 'intelligence':
         case 'iq':
            propertyPath = 'attributes.intelligence'
            break
         case 'emotional_intelligence':
         case 'eq':
            propertyPath = 'attributes.emotionalIntelligence'
            break
         case 'memorization':
         case 'mem':
            propertyPath = 'attributes.memorization'
            break
         case 'imagination':
         case 'img':
            propertyPath = 'attributes.imagination'
            break
         case 'charisma':
         case 'char':
            propertyPath = 'attributes.charisma'
            break

         case 'energy': case 'satisfactory':
            propertyPath = attrName
            break

         case 'sanity': case 'san': case 'mental_health':
            propertyPath = 'mentalHealth'
            break

         case 'money': case 'cash':
            propertyPath = 'money'
            break

         case 'skill_points': case 'skp':
            propertyPath = 'skillPoints'
            break

         default:
            res.json({
               success: false,
               message: `invalid attribute name ${attrName}`
            })
            return
      }

      gameContext.updateTracker.reset()
      updatePlayerProperty(gameContext, propertyPath, 'add', value)
      res.json({
         success: true,
         message: 'success',
         result: sendGameState(gameContext.state, gameContext.updateTracker)
      })
   }
)
debugRouter.post(
   '/trigger_event',
   validateGameContext,
   validateBody({event:'string',args:'object'}),
   (req, res: DebugResponse) => {
      const {event,args} = req.body
      const {gameContext} = res.locals
      console.log(event,args)
      gameContext.updateTracker.reset()
      triggerEvent(gameContext,event,args)
      res.json({
         success: true,
         message: 'success',
         result: sendGameState(gameContext.state, gameContext.updateTracker)
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

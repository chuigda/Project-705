import express = require('express')
import { NextFunction, Request, Response } from 'express'

import serverStore from '@app/server/store'
import { GameContext } from '@app/executor/game_context'
import { IResponse } from '@protocol/index'

import epInitGame from '@app/server/endpoints/init'
import epNextTurn from '@app/server/endpoints/next_turn'
import epLearnSkill from '@app/server/endpoints/skill'
import epSendSnapshot from '@app/server/endpoints/snapshot'
import epGetTranslation from '@app/server/endpoints/translation'
import epActivateAscensionPerk from '@app/server/endpoints/ascension_perk'
import epGetStartups from '@app/server/endpoints/startup'
import { epPurchaseItem, epUseItem } from '@app/server/endpoints/store_item'
import debugRouter from '@app/server/endpoints/debug'

const ACCESS_TOKEN_HEADER = 'X-Fe-Access-Token'

function verifyAccessToken<R>(
   req: Request,
   res: Response<IResponse<R>, { accessToken: string }>,
   next: NextFunction
) {
   const accessToken = req.header(ACCESS_TOKEN_HEADER)
   if (!accessToken) {
      res.status(401).json({
         success: false,
         message: 'not logged in', // TODO(chuigda): use translation keys
      })
      return
   }

   res.locals.accessToken = accessToken
   next()
}

function verifyGameContext<R>(
   req: Request,
   res: Response<IResponse<R>, { accessToken: string, gameContext: GameContext }>,
   next: NextFunction
) {
   const accessToken = req.header(ACCESS_TOKEN_HEADER)
   if (!accessToken) {
      res.status(401).json({
         success: false,
         message: 'not logged in', // TODO(chuigda): use translation keys
      })
      return
   }

   const gameContext = serverStore.getGame(accessToken)
   if (!gameContext) {
      res.status(401).json({
         success: false,
         message: 'game not found' // TODO(chuigda): use translation keys
      })
      return
   }

   res.locals.gameContext = gameContext
   next()
}

function applicationStart() {
   const app = express()

   app.use(express.json())

   app.post('/api/new_game', verifyAccessToken, epInitGame)

   app.get('/api/snapshot', verifyGameContext, epSendSnapshot)

   app.post('/api/next_turn', verifyGameContext, epNextTurn)

   app.post('/api/learn_skill', verifyGameContext, epLearnSkill)

   app.post('/api/ascension', verifyGameContext, epActivateAscensionPerk)

   app.post('/api/purchase_item', verifyGameContext, epPurchaseItem)

   app.post('/api/use_item', verifyGameContext, epUseItem)

   app.get('/api/startups', epGetStartups)

   app.get('/api/translation', epGetTranslation)

   app.use('/api/debug', verifyGameContext, debugRouter)

   app.listen(3000, 'localhost', () => console.info('application started'))
}

export default applicationStart

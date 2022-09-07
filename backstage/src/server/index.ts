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

   app.post('/api/newGame', verifyAccessToken, epInitGame)

   app.get('/api/snapshot', verifyGameContext, epSendSnapshot)

   app.post('/api/nextTurn', verifyGameContext, epNextTurn)

   app.post('/api/learnSkill', verifyGameContext, epLearnSkill)

   app.post('/api/ascension', verifyGameContext, epActivateAscensionPerk)

   app.get('/api/startups', epGetStartups)

   app.get('/api/translation', epGetTranslation)

   app.listen(3000, () => console.info('application started'))
}

export default applicationStart

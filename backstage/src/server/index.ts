import express = require('express')
import { NextFunction, Request, Response } from 'express'

import serverStore from '@app/server/store'
import epLearnSkill from '@app/server/endpoints/learn_skill'
import epGetTranslation from '@app/server/endpoints/translation'
import { GameContext } from '@app/executor/game_context'
import { IResponse } from '@protocol/index'
import epInitGame from '@app/server/endpoints/init'

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

   app.get('/api/snapshot', verifyGameContext, (req, res) => {
      // TODO
   })

   app.post('/api/nextTurn', (req, res) => {
      // TODO
   })

   app.post('/api/learnSkill', verifyGameContext, epLearnSkill)

   app.get('/api/translation', epGetTranslation)

   app.listen(3000, () => console.info('application started'))
}

export default applicationStart

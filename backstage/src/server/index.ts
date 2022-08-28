import express = require('express')
import { NextFunction, Request, Response } from 'express'

import serverStore from '@app/server/store'
import epLearnSkill from '@app/server/endpoints/learn_skill'
import epGetTranslation from '@app/server/endpoints/translation'
import { GameContext } from '@app/executor/game_context'
import { IResponse } from '@protocol/src'

const ACCESS_TOKEN_HEADER = 'X-Fe-Access-Token'

function respondOrErr<T>(resp: any, thing: T | undefined, code: number = 200, msg: string = '') {
   resp.status(code).json({
      success: !!thing,
      msg: msg || '',
      result: thing || null
   })
}

function verifyGameContext<R>(
   req: Request,
   res: Response<IResponse<R>, { gameContext: GameContext }>,
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

   app.post('/api/newGame', (req, res) => {
      // const accessToken = req.header(ACCESS_TOKEN_HEADER)
      // respondOrErr(res, epInit())
   })

   app.get('/api/snapshot', verifyGameContext, (req, res) => {
      // TODO
   })

   app.post('/api/nextTurn', (req, res) => {
      // TODO
   })

   app.post('/api/learnSkill', verifyGameContext, epLearnSkill)

   app.get('/api/translation', epGetTranslation)

   app.listen(3000, () => console.log('application started'))
}

export default applicationStart

import { NextFunction, Request, Response } from 'express'
import { typeAssert } from '@app/util/type_assert'
import { IResponse } from '@protocol/index'
import { GameContext } from '@app/executor/game_context'
import serverStore from '@app/server/store'

const ACCESS_TOKEN_HEADER = 'X-Access-Token'

export type ValidationFunction = (req: Request, res: Response<IResponse<any>>, next: NextFunction) => void

export function validateQuery(assertion: any): ValidationFunction {
   return (req, res, next) => {
      const { query } = req
      try {
         typeAssert(query, assertion)
      } catch (e) {
         res.status(400).json({
            success: false,
            message: e
         })
         return
      }

      next()
   }
}

export function validateBody(assertion: any): ValidationFunction {
   return (req, res, next) => {
      const { body } = req
      try {
         typeAssert(body, assertion)
      } catch (e) {
         res.status(400).json({
            success: false,
            message: e
         })
         return
      }

      next()
   }
}

export function validateAccessToken<R>(
   req: Request,
   res: Response<IResponse<R>, { accessToken: string }>,
   next: NextFunction
) {
   const accessToken = req.header(ACCESS_TOKEN_HEADER)
   if (!accessToken) {
      res.status(401).json({
         success: false,
         message: 'NOT_LOGGED_IN',
      })
      return
   }

   res.locals.accessToken = accessToken
   next()
}

export function validateGameContext<R>(
   req: Request,
   res: Response<IResponse<R>, { accessToken: string, gameContext: GameContext }>,
   next: NextFunction
) {
   const accessToken = req.header(ACCESS_TOKEN_HEADER)
   if (!accessToken) {
      res.status(401).json({
         success: false,
         message: 'NOT_LOGGED_IN',
      })
      return
   }

   const gameContext = serverStore.getGame(accessToken)
   if (!gameContext) {
      res.status(401).json({
         success: false,
         message: 'GAME_NOT_FOUND'
      })
      return
   }

   res.locals.gameContext = gameContext
   next()
}

import { NextFunction, Request, Response } from 'express'
import { typeAssert } from '@app/util/type_assert'
import { IResponse } from '@protocol/index'

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

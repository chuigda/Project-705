import express = require('express')
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { IResponse } from '@protocol/index'

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

export default debugRouter

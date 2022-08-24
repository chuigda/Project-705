import express = require('express')
import epInit from './endpoints/init'
import epNextTurn from './endpoints/next_turn'
import epGetSnapshot from './endpoints/snapshot'
import epGetTranslation from './endpoints/translation'

const ACCESS_TOKEN_HEADER = 'X-Fe-Access-Token'

function respondOrErr<T>(resp: any, thing: T | undefined, code: number = 200, msg: string = '') {
   resp.status(code).json({
      success: !!thing,
      msg: msg || '',
      result: thing || null
   })
}

function applicationStart() {
   const app = express()

   app.post('/api/newGame', (req, res) => {
      // const accessToken = req.header(ACCESS_TOKEN_HEADER)
      respondOrErr(res, epInit())
   })

   app.get('/api/snapshot', (req, res) => {
      const accessToken = req.header(ACCESS_TOKEN_HEADER)
      const ctx = epGetSnapshot(accessToken)
      respondOrErr(res, ctx, 404, 'game not found')
   })

   app.post('/api/nextTurn', (req, res) => {
      const accessToken = req.header(ACCESS_TOKEN_HEADER)
      const ctx = epNextTurn(accessToken)
      respondOrErr(res, ctx, 404, 'game not found')
   })

   app.get('/api/translation', (req, res) => {
      respondOrErr(res, epGetTranslation(req.query.lang), 400, 'no such lang')
   })

   app.listen(3000, () => console.log('application started'))
}

export default applicationStart

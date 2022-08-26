import ruleSet from '@app/server/ruleset'
import { Request, Response } from 'express'
import { IResponse, ITranslation } from '@protocol/src'

export default function epGetTranslation(req: Request, res: Response<IResponse<ITranslation>>) {
   const { lang } = req.query
   if (lang && typeof lang === 'string') {
      res.json({
         success: true,
         message: 'success', // TODO(chuigda): use translation keys
         result: ruleSet.translations[lang] || {}
      })
   } else {
      res.status(400).json({
         success: false,
         message: 'invalid language'
      })
   }
}

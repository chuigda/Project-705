import { Request, Response } from 'express'
import { IResponse, IStartup } from '@protocol/index'
import ruleSet from '@app/server/ruleset'
import { sendStartup } from '@app/server/mapping'

export default function epGetStartups(req: Request, res: Response<IResponse<IStartup[]>>) {
   res.json({
      success: true,
      message: 'success',
      result: Object.values(ruleSet.startups).map(sendStartup)
   })
}

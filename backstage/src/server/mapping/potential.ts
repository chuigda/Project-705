import {
   HasSkillOrNot,
   isHasSkillOrNot,
   isPotentialFunctionResult,
   PotentialFunctionResult,
   PotentialLogicOpResult,
   PotentialResult, SkillPotentialResult
} from '@app/executor/compute'
import { IPotentialResult, ISkillPotentialResult } from '@protocol/potential'

import { sendTranslatable, sendTranslationKey } from './translation'

export function sendPotentialResult(pr: PotentialResult): IPotentialResult {
   if (isPotentialFunctionResult(pr)) {
      pr = <PotentialFunctionResult>pr
      return {
         type: 'fn',
         result: pr.result,
         description: sendTranslatable(pr.description)
      }
   }

   pr = <PotentialLogicOpResult>pr
   return {
      type: 'logicOp',
      result: pr.result,
      resultPieces: pr.resultPieces.map(p => sendPotentialResult(p))
   }
}

export function sendSkillPotentialResult(spr: SkillPotentialResult): ISkillPotentialResult {
   if (isHasSkillOrNot(spr)) {
      spr = <HasSkillOrNot>spr
      return {
         type: 'skill',
         result: spr.result,
         skillId: spr.skillId,
         skillName: sendTranslationKey(spr.skillName)
      }
   } else {
      return sendPotentialResult(<PotentialResult>spr)
   }
}

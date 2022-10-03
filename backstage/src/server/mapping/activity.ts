import { Activity, ActivityOutput } from '@app/ruleset'
import { IActivity, IActivityOutput } from '@protocol/activity'
import { sendPartialPlayerAttributes } from '@app/server/mapping/player'
import { sendItemBase } from '@app/server/mapping/item_base'

export function sendActivityOutput(ao: ActivityOutput): IActivityOutput {
   return {
      attributes: ao.attributes && sendPartialPlayerAttributes(ao.attributes),
      skillPoints: ao.skillPoints,
      mentalHealth: ao.mentalHealth,
      satisfactory: ao.satisfactory,
      money: ao.money
   }
}

export function sendActivity(a: Activity): IActivity {
   return {
      ...sendItemBase(a),

      category: a.category,
      level: a.level,
      output: a.output && sendActivityOutput(a.output)
   }
}

import { Activity } from '@app/ruleset'
import { IActivity } from '@protocol/activity'
import { sendItemBase } from '@app/server/mapping/item_base'

export function sendActivity(a: Activity): IActivity {
   return {
      ...sendItemBase(a),

      category: a.category,
      level: a.level,
      output: a.output
   }
}

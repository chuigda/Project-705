import { Startup } from '@app/core/ruleset'
import { IStartup } from '@protocol/index'
import { sendItemBase } from './item_base'

export function sendStartup(startup: Startup): IStartup {
   return sendItemBase(startup)
}

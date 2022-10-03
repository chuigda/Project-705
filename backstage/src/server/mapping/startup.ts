import { Startup, StartupPlayerProperties } from '@app/ruleset'
import { IStartup, IStartupPlayerProperties } from '@protocol/index'

import { sendPartialPlayerAttributes } from './player'
import { sendItemBase } from './item_base'

function sendStartupPlayerProperties(properties: StartupPlayerProperties): IStartupPlayerProperties {
   return {
      ...properties,

      attributes: properties.attributes ? sendPartialPlayerAttributes(properties.attributes) : undefined,
      talent: properties.talent ? sendPartialPlayerAttributes(properties.talent) : undefined
   }
}

export function sendStartup(startup: Startup): IStartup {
   return {
      ...sendItemBase(startup),

      player: startup.player ? sendStartupPlayerProperties(startup.player) : undefined
   }
}

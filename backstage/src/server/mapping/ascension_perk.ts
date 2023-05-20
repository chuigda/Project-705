import { AscensionPerk } from '@app/core/ruleset'
import { IAscensionPerk } from '@protocol/ascension_perk'
import { sendItemBase } from '@app/server/mapping/item_base'

export function sendAscensionPerk(a: AscensionPerk): IAscensionPerk {
   return sendItemBase(a)
}

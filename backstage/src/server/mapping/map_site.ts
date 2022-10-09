import { MapBranch, MapSite } from '@app/ruleset'
import { sendTranslationKey } from '@app/server/mapping/translation'
import { sendItemBase } from '@app/server/mapping/item_base'
import { MapStatus } from '@app/executor/game_context'
import { IGeneratedBranch, IGeneratedSite, IMapBranch, IMapSite, IMapStatus } from '@protocol/map_site'
import { GeneratedBranch, GeneratedSite } from '@app/executor/map_site'

export function sendMapBranch(b?: MapBranch): IMapBranch | undefined {
   if (b === undefined) {
      return undefined
   }
   return {
      description: sendTranslationKey(b.description)
   }
}

export function sendMapSite(s: MapSite): IMapSite {
   return {
      ...sendItemBase(s),

      branches: [sendMapBranch(s.branches[0])!, sendMapBranch(s.branches[1])],
      energyCost: s.energyCost
   }
}

export function sendGeneratedBranch(b?: GeneratedBranch): IGeneratedBranch | undefined {
   if (b === undefined) {
      return undefined
   }
   return {
      desc: b.desc && sendTranslationKey(b.desc),
      next: sendGeneratedSite(b.next),
   }
}

export function sendGeneratedSite(s: GeneratedSite): IGeneratedSite {
   if (s.isLeafSite()) {
      return {
         site: sendMapSite(s.site),
      }
   }
   return {
      site: sendMapSite(s.site),
      left: sendGeneratedBranch(s.left),
      right: sendGeneratedBranch(s.right),
   }
}

export function sendMap(m: MapStatus): IMapStatus {
   return {
      rootSite: sendGeneratedSite(m.rootSite)
   }
}

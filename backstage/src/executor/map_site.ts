import { GameContext, GameState } from '@app/executor/game_context'
import {
   MapBranch,
   MapSite,
   MapSiteCustomFuncSelector,
   MapSiteIdentSelector,
   mMapSiteId,
   mTranslationKey
} from '@app/ruleset'
import { randChoose, randPropValue } from '@app/util/rand'

export class GeneratedSite {
   site: MapSite
   left?: GeneratedBranch
   right?: GeneratedBranch

   constructor(site: MapSite) {
      this.site = site
   }

   isNextHidden() {
      return this.left === undefined
   }
}

export class GeneratedBranch {
   desc: string
   next: GeneratedSite
}

function randomSite(gameContext: GameContext): MapSite {
   return randPropValue(gameContext.ruleSet.mapSites)
}

function genSiteByBranch(gameContext: GameContext, br: MapBranch, selectedSite: GeneratedSite): MapSite | undefined {
   switch (br.selector.type) {
      case 'by_ident': {
         const selector = <MapSiteIdentSelector>br.selector
         return gameContext.ruleSet.mapSites[randChoose(<string[]>selector.idents)] // maybe undefined
      }
      case 'random': {
         return randomSite(gameContext)
      }
      default: {
         const selector = <MapSiteCustomFuncSelector>br.selector
         return selector.func(gameContext, selectedSite.site)
      }
   }
}

function generateNextLevel(gameContext: GameContext, curr: GeneratedSite, selectedSite: GeneratedSite) {
   if (!curr.isNextHidden()) {
      return
   }
   const [brl, brr] = curr.site.branches
   let site = genSiteByBranch(gameContext, brl, selectedSite)
   let desc = <string>brl.description
   if (site === undefined) {
      site = randomSite(gameContext)
      desc = ''
   }
   const newLeftSite = new GeneratedSite(site)
   const newLeft: GeneratedBranch = {
      desc,
      next: newLeftSite
   }
   curr.left = newLeft
   if (brr === undefined) {
      return
   }
   site = genSiteByBranch(gameContext, brr, selectedSite)
   desc = <string>brr.description
   if (site === undefined) {
      site = randomSite(gameContext)
      desc = ''
   }
   const newRightSite = new GeneratedSite(site)
   const newRight: GeneratedBranch = {
      desc,
      next: newRightSite
   }
   curr.right = newRight
}

const MAX_DEPTH = 4

function initMapHelper(gameContext: GameContext, curr: GeneratedSite, selectedSite: GeneratedSite, depth: number) {
   if (depth >= MAX_DEPTH) {
      return
   }
   generateNextLevel(gameContext, curr, selectedSite)
   initMapHelper(gameContext, curr.left!.next, selectedSite, depth + 1)
   if (curr.right) {
      initMapHelper(gameContext, curr.right.next, selectedSite, depth + 1)
   }
}

export function initMap(gameContext: GameContext) {
   const initialSite: GeneratedSite = new GeneratedSite(randomSite(gameContext))
   initMapHelper(gameContext, initialSite, initialSite, 1)
   gameContext.state.map.rootSite = initialSite
}

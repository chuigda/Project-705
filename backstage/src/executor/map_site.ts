import { GameContext } from '@app/executor/game_context'
import {
   MapBranch,
   MapSite,
   MapSiteCustomFuncSelector,
   MapSiteIdentSelector,
   MaybeTranslationKey,
} from '@app/ruleset'
import { randChoose, randPropValue } from '@app/util/rand'

export class GeneratedSite {
   site: MapSite
   left?: GeneratedBranch
   right?: GeneratedBranch

   constructor(site: MapSite) {
      this.site = site
   }

   isLeafSite() {
      return this.left === undefined
   }
}

export class GeneratedBranch {
   desc?: MaybeTranslationKey
   next: GeneratedSite
}

function randomSite(gameContext: GameContext): MapSite {
   return randPropValue(gameContext.ruleSet.mapSites)!
}

function genSiteByBranch(gameContext: GameContext, br: MapBranch, selectedSite: GeneratedSite): MapSite {
   switch (br.selector.type) {
      case 'by_ident': {
         const selector = <MapSiteIdentSelector>br.selector
         return gameContext.ruleSet.mapSites[randChoose(<string[]>selector.idents)!] // maybe undefined
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
   if (!curr.isLeafSite()) {
      return
   }

   const [brl, brr] = curr.site.branches
   let site = genSiteByBranch(gameContext, brl, selectedSite)
   let desc = <MaybeTranslationKey | undefined>brl.description
   if (site === undefined) {
      site = randomSite(gameContext)
      desc = undefined
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
      desc = undefined
   }
   const newRightSite = new GeneratedSite(site)
   const newRight: GeneratedBranch = {
      desc,
      next: newRightSite
   }
   curr.right = newRight
}

const MAX_DEPTH = 4

function initMapDfsHelper(gameContext: GameContext, curr: GeneratedSite, selectedSite: GeneratedSite, depth: number) {
   if (depth >= MAX_DEPTH) {
      return
   }
   generateNextLevel(gameContext, curr, selectedSite)
   initMapDfsHelper(gameContext, curr.left!.next, selectedSite, depth + 1)
   if (curr.right) {
      initMapDfsHelper(gameContext, curr.right.next, selectedSite, depth + 1)
   }
}

export function initMap(gameContext: GameContext) {
   const initialSite: GeneratedSite = new GeneratedSite(randomSite(gameContext))
   initMapDfsHelper(gameContext, initialSite, initialSite, 1)
   gameContext.state.map.rootSite = initialSite
   gameContext.updateTracker.map = true
}

type PathDirection = 'left' | 'right'

function choosePathDfsHelper(gameContext: GameContext, root: GeneratedSite) {
   const stack = [root]
   while (stack.length !== 0) {
      const curr = stack.pop()!
      if (curr.isLeafSite()) {
         generateNextLevel(gameContext, curr, root)
         continue
      }
      if (curr.right !== undefined) {
         stack.push(curr.right.next)
      }
      stack.push(curr.left!.next)
   }
}

export function choosePath(gameContext: GameContext, nextdir: PathDirection) {
   const { rootSite } = gameContext.state.map
   // if the current site has only one path, then ignore the choice
   if (gameContext.state.map.rootSite.right === undefined) {
      nextdir = 'left'
   }
   const { next } = rootSite[nextdir]!
   gameContext.state.map.rootSite = next
   gameContext.updateProperty('energy', 'sub', next.site.energyCost, '@map_move')
   gameContext.updateTracker.map = true
   choosePathDfsHelper(gameContext, next)
}

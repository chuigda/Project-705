import { ItemBase } from '@app/ruleset/items/item_base'
import { Ident, MaybeInlineEvent, MaybeTranslationKey } from '@app/ruleset'
import { GameContext } from '@app/executor/game_context'

type MapSiteType =
   'normal'
   | 'split'
   | 'split_join'

export interface MapSiteBase<MST extends MapSiteType> extends ItemBase {
   readonly type: MST
}

export interface NormalMapSite extends MapSiteBase<'normal'> {
   events?: MaybeInlineEvent[]
}

type MapSiteSelectorType =
   'random'
   | 'by_ident'
   | 'custom_func'

export interface MapSiteSelectorBase<MSST extends MapSiteSelectorType> {
   readonly type: MSST
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapSiteRandomSelector extends MapSiteSelectorBase<'random'> {}

export interface MapSiteIdentSelector extends MapSiteSelectorBase<'by_ident'> {
   readonly ident: Ident[]
}

export interface MapSiteCustomFuncSelector extends MapSiteSelectorBase<'custom_func'> {
   readonly func: (gameContext: GameContext, prevSite: MapSiteBase<MapSiteType>) => MapSiteBase<MapSiteType>
}

export type MapSiteSelector = MapSiteRandomSelector | MapSiteIdentSelector | MapSiteCustomFuncSelector

export interface MapBranch {
   ident: string
   description: MaybeTranslationKey
   path: MapSiteSelectorBase<MapSiteSelectorType>[]
}

export interface SplitMapSite extends MapSiteBase<'split'> {
   branches: MapBranch[]
}

export interface SplitJoinMapSite extends MapSiteBase<'split_join'> {
   branches: MapBranch[]
   joinNode: MapSiteSelector
}

export type MapSite = NormalMapSite | SplitMapSite | SplitJoinMapSite

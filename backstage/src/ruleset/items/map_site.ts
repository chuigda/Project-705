import { ItemBase } from '@app/ruleset/items/item_base'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent, MaybeTranslationKey, Ident } from '@app/ruleset'
import { GameContext } from '@app/executor/game_context'

export interface MapSite extends ItemBase {
   events?: MaybeInlineEvent[]
   potentials?: PotentialExpression[]
   branches: [MapBranch, MapBranch?]
   energyCost: number
}

type MapSiteSelectorType =
   'random'
   | 'by_ident'
   | 'custom_func'

export interface MapSiteSelectorBase<MSST extends MapSiteSelectorType> {
   readonly type: MSST
}

export type MapSiteRandomSelector = MapSiteSelectorBase<'random'>

export interface MapSiteIdentSelector extends MapSiteSelectorBase<'by_ident'> {
   readonly idents: Ident[]
}

export interface MapSiteCustomFuncSelector extends MapSiteSelectorBase<'custom_func'> {
   readonly func: (gameContext: GameContext, selectedSite: MapSite) => MapSite
}

export type MapSiteSelector = MapSiteRandomSelector | MapSiteIdentSelector | MapSiteCustomFuncSelector

export interface MapBranch {
   description: MaybeTranslationKey
   selector: MapSiteSelectorBase<MapSiteSelectorType>
}

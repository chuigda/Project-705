import { ItemBase } from '@app/core/ruleset/items/item_base'
import { PotentialExpression } from '@app/core/ruleset/items/potential'
import { MaybeInlineEvent, MaybeTranslationKey, Ident } from '@app/core/ruleset'
import { GameContext } from '@app/core/game_context'

/// 地图节点
///
/// Project-705 采用类似于“爬塔”（杀戮尖塔，邪恶铭刻）的方式取代了原版游戏中的挖脑洞（踩地雷）方式。
export interface MapSite extends ItemBase {
   /// 进入地图节点触发的事件
   events?: MaybeInlineEvent[]

   /// 解锁这一地图节点的条件
   potentials?: PotentialExpression[]

   /// 地图节点的后续分支
   branches: [MapBranch, MapBranch?]

   /// 进入节点所消耗的能量
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

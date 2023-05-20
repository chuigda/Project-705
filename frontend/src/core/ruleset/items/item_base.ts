import { Ident, MaybeTranslationKey, Scope } from '@app/core/base/uid'

/// 暂未使用
export type PatchMode = 'overwrite' | 'and' | 'or'

/// 大部分可定制项目 (例如技能/活动/飞升天赋) 的 “基类”
export interface ItemBase {
   /// 唯一标识
   readonly ident: Ident

   /// 项目名
   readonly name: MaybeTranslationKey

   /// 项目描述
   readonly description: MaybeTranslationKey

   /// 未使用
   readonly patch?: PatchMode

   /// 作用域
   readonly scope?: Scope
}

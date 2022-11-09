import { MaybeTranslationKey } from '@app/base/uid'

/// 活动类别 ID
///
/// **注意:** 不同于其他常见的 ID，活动类别 ID 被视为是“全局唯一”的，不会在被规则集加载时被名称重整
export type ActivityCategoryId = string

/// 技能类别 ID
///
/// **注意:** 不同于其他常见的 ID，技能类别 ID 被视为是“全局唯一”的，不会在被规则集加载时被名称重整
export type SkillCategoryId = string

/// 技能类别
///
/// 对应于原版游戏中的技能类别
export interface SkillCategory {
   /// 技能类别 ID
   readonly ident: SkillCategoryId

   /// 技能类别名称
   readonly name: MaybeTranslationKey

   /// 技能类别描述
   readonly description: MaybeTranslationKey
}

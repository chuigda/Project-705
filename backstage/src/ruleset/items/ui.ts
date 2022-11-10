import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { MaybeTranslatable } from '@app/base/translation'
import { IBubbleMessageIcon, IBubbleMessageKind } from '@protocol/ui'

/// 对话框中的一个选项
export interface DialogOption {
   /// 选项的标识符
   ///
   /// 这个值不需要是全局唯一的，只需在对话框内唯一即可
   readonly optionKey: string

   /// 选项文本
   readonly text: MaybeTranslatable

   /// 鼠标悬浮在选项上时显示的提示文本
   readonly tooltip: MaybeTranslatable

   /// 是否显示为危险选项
   readonly danger?: boolean

   /// 选项反馈
   readonly textResponse: MaybeTranslatable

   /// 点击选项所触发的事件
   readonly onClickEvents: MaybeInlineEvent[]
}

/// 简单对话框模板
export interface SimpleDialogTemplate {
   /// 对话框标题
   readonly title: MaybeTranslatable

   /// 对话框图片
   // TODO(chuigda, flaribbit): properly handle this when we have gfx features
   readonly picture?: string

   /// 对话框文本
   readonly text: MaybeTranslatable

   /// 对话框选项
   readonly options: DialogOption[]
}

export type BubbleMessageIcon = IBubbleMessageIcon
export type BubbleMessageKind = IBubbleMessageKind

/// 气泡消息模板基类
export interface BubbleMessageTemplateBase<MessageKindString extends BubbleMessageKind> {
   /// 气泡消息类别
   readonly kind: MessageKindString

   /// 消息图标
   readonly icon: BubbleMessageIcon

   /// 鼠标悬浮在气泡消息上时显示的提示文本
   readonly tooltip: MaybeTranslatable
}

/// 提示型气泡消息模板
///
/// 仅仅作为一个提示，点击后就会被关闭
export type PromptBubbleMessageTemplate = BubbleMessageTemplateBase<'prompt'>

/// 对话框型气泡消息模板
///
/// 点击后弹出预设的对话框，玩家和对话框交互完毕后，气泡消息将被关闭。
/// 玩家可以暂时关闭对话框，但消息和对话框都会被保留，直到用户处理完毕为止。
export interface DialogBubbleMessageTemplate extends BubbleMessageTemplateBase<'user_dialog'> {
   readonly dialogTemplate: SimpleDialogTemplate
}

/// 气泡消息模板
///
/// 类似于原版中的气泡消息，不同类别的消息可以拉起不同类别的互动。
export type BubbleMessageTemplate = PromptBubbleMessageTemplate | DialogBubbleMessageTemplate

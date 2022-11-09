import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { MaybeTranslatable } from '@app/base/translation'
import { IBubbleMessageIcon, IBubbleMessageKind } from '@protocol/ui'

export interface DialogOption {
   optionKey: string
   text: MaybeTranslatable
   tooltip: MaybeTranslatable
   readonly onClickEvents: MaybeInlineEvent[]
}

export interface SimpleDialogTemplate {
   readonly title: MaybeTranslatable
   // TODO(chuigda, flaribbit): properly handle this when we have gfx features
   readonly picture?: string
   readonly text: MaybeTranslatable
   readonly options: DialogOption[]
}

export type BubbleMessageIcon = IBubbleMessageIcon
export type BubbleMessageKind = IBubbleMessageKind

export interface BubbleMessageTemplateBase<MessageKindString extends BubbleMessageKind> {
   readonly kind: MessageKindString

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslatable
}

export type PromptBubbleMessageTemplate = BubbleMessageTemplateBase<'prompt'>

export interface DialogBubbleMessageTemplate extends BubbleMessageTemplateBase<'user_dialog'> {
   readonly dialogTemplate: SimpleDialogTemplate
}

export type BubbleMessageTemplate = PromptBubbleMessageTemplate | DialogBubbleMessageTemplate

import { Ident, MaybeTranslationKey } from '@app/base/uid'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export class Label {
   readonly text: MaybeTranslationKey
}

export class Button {
   readonly ident: Ident
   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey

   readonly events: MaybeInlineEvent[]
}

export class Divider {}

export type MenuItem = Button | Menu | Divider

export class Menu {
   readonly ident: Ident
   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey

   readonly children: MenuItem[]
}

export class DialogOption {
   readonly optionKey: string

   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey
   readonly danger: boolean
   readonly onClickEvents: MaybeInlineEvent[]
}

export class SimpleDialogTemplate {
   readonly ident: Ident

   readonly title: MaybeTranslationKey
   readonly text: MaybeTranslationKey
   readonly options: DialogOption[]
}

// TODO(chuigda): add more when we have gfx features
export type BubbleMessageIcon = 'normal' | 'important'

export class BubbleMessageTemplate {
   readonly ident: Ident

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslationKey
   readonly linkedDialog: Ident | SimpleDialogTemplate
}

export class CustomScoreBoard {
   readonly ident: Ident
   readonly tooltip: MaybeTranslationKey
   readonly color: string

   readonly value?: MaybeTranslationKey
   readonly bind?: Ident
}

export class CustomUI {
   menus?: Menu[]
   buttons?: Button[]
   scoreBoards?: CustomScoreBoard[]

   dialogTemplates?: SimpleDialogTemplate[]
   bubbleMessageTemplates?: BubbleMessageTemplate[]
}

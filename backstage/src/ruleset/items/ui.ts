import { Ident, MaybeTranslationKey } from '@app/base/uid'
import { MaybeInlineEvent } from '@app/ruleset/items/event'

export interface Label {
   readonly type: 'label'

   readonly text: MaybeTranslationKey
}

export interface Button {
   readonly type: 'button'

   readonly ident: Ident
   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey

   readonly events: MaybeInlineEvent[]
}

export interface Divider {
   readonly type: 'divider'
}

export type MenuItem = Button | Menu | Divider

export interface Menu {
   readonly type: 'menu'

   readonly ident: Ident
   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey

   readonly children: MenuItem[]
}

export function isDivider(menuItem: MenuItem): boolean {
   return menuItem.type === 'divider'
}

export function isButton(menuItem: MenuItem): boolean {
   return menuItem.type === 'button'
}

export interface DialogOption {
   readonly optionKey: string

   readonly text: MaybeTranslationKey
   readonly tooltip: MaybeTranslationKey
   readonly danger: boolean
   readonly onClickEvents: MaybeInlineEvent[]
}

export interface SimpleDialogTemplate {
   readonly ident: Ident

   readonly title: MaybeTranslationKey
   readonly text: MaybeTranslationKey
   readonly options: DialogOption[]
}

// TODO(chuigda): add more when we have gfx features
export type BubbleMessageIcon = 'normal' | 'important'

export interface BubbleMessageTemplate {
   readonly ident: Ident

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslationKey
   readonly linkedDialog: Ident | SimpleDialogTemplate
}

export interface CustomScoreBoard {
   readonly ident: Ident
   readonly tooltip: MaybeTranslationKey
   readonly color: string

   readonly value?: MaybeTranslationKey
   readonly bind?: Ident
}

export interface CustomUI {
   menus?: Menu[]
   buttons?: Button[]
   scoreBoards?: CustomScoreBoard[]

   dialogTemplates?: SimpleDialogTemplate[]
   bubbleMessageTemplates?: BubbleMessageTemplate[]
}

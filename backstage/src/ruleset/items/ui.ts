import { Ident } from '@app/base/uid'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { MaybeTranslatable } from '@app/base/translation'

export interface Label {
   readonly type: 'label'

   readonly text: MaybeTranslatable
}

export interface Button {
   readonly type: 'button'

   readonly ident: Ident
   readonly text: MaybeTranslatable
   readonly tooltip: MaybeTranslatable

   readonly events: MaybeInlineEvent[]
}

export interface Divider {
   readonly type: 'divider'
}

export type MenuItem = Button | Menu | Divider

export interface Menu {
   readonly type: 'menu'

   readonly ident: Ident
   readonly text: MaybeTranslatable
   readonly tooltip: MaybeTranslatable

   readonly children: MenuItem[]
}

export function isDivider(menuItem: MenuItem): boolean {
   return menuItem.type === 'divider'
}

export function isButton(menuItem: MenuItem): boolean {
   return menuItem.type === 'button'
}

export function isMenu(menuItem: MenuItem): boolean {
   return menuItem.type === 'menu'
}

export interface DialogOption {
   readonly optionKey: string

   readonly text: MaybeTranslatable
   readonly tooltip: MaybeTranslatable
   readonly danger: boolean
   readonly onClickEvents: MaybeInlineEvent[]
}

export interface SimpleDialogTemplate {
   readonly ident: Ident

   readonly title: MaybeTranslatable
   readonly text: MaybeTranslatable
   readonly options: DialogOption[]
}

// TODO(chuigda): add more when we have gfx features
export type BubbleMessageIcon = 'normal' | 'important'

export interface BubbleMessageTemplate {
   readonly ident: Ident

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslatable
   readonly linkedDialog: Ident | SimpleDialogTemplate
}

export interface CustomUI {
   menus?: Menu[]
   buttons?: Button[]

   dialogTemplates?: SimpleDialogTemplate[]
   bubbleMessageTemplates?: BubbleMessageTemplate[]
}

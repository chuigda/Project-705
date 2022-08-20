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

export class DialogBase {
   readonly ident: Ident

   readonly title: MaybeTranslationKey
   readonly text: MaybeTranslationKey
   readonly closable: boolean
   readonly onCloseEvents?: MaybeInlineEvent[]
}

export class SimpleDialog extends DialogBase {
   readonly options: Button[]
}

export type UIItem = Button | Menu | Label

export class DialogItem {
   readonly item: UIItem

   readonly row: number
   readonly col: number
   readonly width: number
   readonly height: number
}

export class CustomDialog extends DialogBase {
   readonly width: number
   readonly height: number
   readonly rows: number
   readonly columns: number

   readonly items: DialogItem[]
}

// TODO(chuigda): add more when we have gfx features
type BubbleMessageIcon = 'normal' | 'important'

export class BubbleMessage {
   readonly ident: Ident
   readonly uid: string

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslationKey

   readonly dialog?: Ident
}

export class CustomScoreBoard {
   readonly ident: Ident
   readonly tooltip: MaybeTranslationKey
   readonly color: MaybeTranslationKey

   readonly value?: MaybeTranslationKey
   readonly bind?: Ident
}

export class CustomUI {
   menus?: Menu[]
   dialogs?: DialogBase[]
   bubbles?: BubbleMessage[]
   scoreBoards?: CustomScoreBoard[]
}

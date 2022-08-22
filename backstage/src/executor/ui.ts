import { Ident, MaybeTranslationKey } from '@app/base/uid'
import { BubbleMessageIcon, SimpleDialogTemplate } from '@app/ruleset/items/ui'

export class SimpleDialog extends SimpleDialogTemplate {
   readonly uid: string

   display: boolean
}

export class BubbleMessage {
   readonly ident: Ident
   readonly uid: string

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslationKey
   readonly linkedDialog: string
}

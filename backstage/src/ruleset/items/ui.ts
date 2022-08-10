import { Ident } from '@app/base/uid'
import { Event } from '@app/ruleset/items/event'
import { ItemBase } from'@app/ruleset/items/item_base'

export class CustomButton extends ItemBase {
   readonly events: Event[]
}

export type CustomMenuItem = CustomButton | CustomMenu

export class CustomMenu extends ItemBase {
   readonly children: CustomMenuItem[]
}

export class SimpleDialog {
   readonly ident: Ident
   readonly uid: string

   readonly title: string
   readonly text: string
   readonly closable: boolean
   readonly options: CustomButton[]

   readonly onCloseEvents?: Event[]
}

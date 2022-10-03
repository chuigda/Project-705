import { ItemBase } from '@app/ruleset/items/item_base'
import { sendTranslationKey } from '@app/server/mapping/translation'

export function sendItemBase(itemBase: ItemBase): { ident: string, name: string, description: string } {
   return {
      ident: <string>itemBase.ident,
      name: sendTranslationKey(itemBase.name),
      description: sendTranslationKey(itemBase.description)
   }
}

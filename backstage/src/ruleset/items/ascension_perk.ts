import { ItemBase, PatchMode } from '@app/ruleset/items/item_base'
import { PotentialExpression } from '@app/ruleset/items/potential'
import { MaybeInlineEvent } from '@app/ruleset/items/event'
import { Ident, MaybeTranslationKey, Scope } from '@app/base/uid'

export class AscensionPerk extends ItemBase {
   readonly potential?: PotentialExpression[]
   readonly modifier?: object
   readonly events?: MaybeInlineEvent[]
}

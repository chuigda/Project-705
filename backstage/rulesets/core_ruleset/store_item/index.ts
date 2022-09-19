import { StoreItem } from '@app/ruleset'
import consumableItems from '@rulesets/core_ruleset/store_item/consumable'
import rechargeableItems from '@rulesets/core_ruleset/store_item/rechargeable'
import tradableItems from '@rulesets/core_ruleset/store_item/tradable'

const storeItems: StoreItem[] = [
   ...consumableItems,
   ...rechargeableItems,
   ...tradableItems
]

export default storeItems

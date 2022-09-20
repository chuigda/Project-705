import { RuleSetStoreItems } from '@app/ruleset'
import consumableItems from '@rulesets/core_ruleset/store_item/consumable'
import rechargeableItems from '@rulesets/core_ruleset/store_item/rechargeable'
import tradableItems from '@rulesets/core_ruleset/store_item/tradable'
import passiveRelicItems from '@rulesets/core_ruleset/store_item/passive_relic'

const storeItems: RuleSetStoreItems = {
   consumableItems,
   rechargeableItems,
   passiveRelicItems,
   tradableItems
}

export default storeItems

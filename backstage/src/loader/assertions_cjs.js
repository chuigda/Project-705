// noinspection JSUnresolvedFunction

// Don't build assertions with TypeScript
// because I don't know how to make these defineProperty magic work with TypeScript

const { enableChainAPI } = require('../util/type_assert_cjs')

enableChainAPI()

const identAssertion = 'string'.sumWith({
   author: 'string',
   moduleName: 'string',
   id: 'string'
})

const translationKeyAssertion = identAssertion

const composedTranslatableAssertion = {
   template: translationKeyAssertion
}

const translatableAssertion = translationKeyAssertion.sumWith(composedTranslatableAssertion)

composedTranslatableAssertion.args = 'object'.assertObjectValue(translatableAssertion)

const patchModeAssertion = {
   patch: 'string'.chainWith(x => x === 'patch' || x === 'overwrite').orNull()
}

const eventSeriesAssertion = ['function'.sumWith(identAssertion)]

const potentialExpressionArgumentsAssertion = [/* potentialExpressionAssertion */]

const potentialExpressionAssertion = {
   op: 'string'.chainWith(x => x === 'and' || x === 'or' || x === 'not'),
   arguments: potentialExpressionArgumentsAssertion.chainWith(arr => arr.length >= 1)
}.sumWith({
   op: 'function',
   description: translatableAssertion
})

potentialExpressionArgumentsAssertion.push(potentialExpressionAssertion)

const baseAssertion = {
   ident: identAssertion,
   name: translationKeyAssertion,
   description: translationKeyAssertion,
}

const propertiesAssertion = 'object'.assertObjectValue('number')

const activityAssertion = {
   ...baseAssertion,

   category: 'string',
   level: 'number',

   output: propertiesAssertion.orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const ascensionPerkAssertion = {
   ...baseAssertion,

   potential: [potentialExpressionAssertion].orNull(),
   modifier: identAssertion.orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const skillAssertion = {
   ...baseAssertion,

   category: 'string',
   potential: [identAssertion.sumWith(potentialExpressionAssertion)].orNull(),
   cost: {
      base: 'number',
      properties: propertiesAssertion.orNull()
   },
   output: propertiesAssertion.orNull(),
   activities: [identAssertion].orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const startupAssertion = {
   ...baseAssertion,
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const eventAssertion = {
   ident: identAssertion,
   event: 'function',

   ...patchModeAssertion
}

const propertyModifierAssertion = 'object'.assertObjectValue({ gain: 'number?', loss: 'number?' })

const modifierAssertion = {
   ...baseAssertion,
   icon: 'string?',
   player: 'object?'.assertObjectValue(propertyModifierAssertion),
   skillPointCost: 'object?'.assertObjectValue('number'),

   ...patchModeAssertion
}

const storeItemBaseAssertion = {
   ...baseAssertion,
   level: 'string?'.chainWith(x => ['normal', 'rare', 'epic', 'legend', 'myth'].includes(x)),
   price: 'number?',
   energyCost: 'number?'
}

const consumableItemAssertion = {
   ...storeItemBaseAssertion,
   kind: 'string'.assertValue('consumable'),
   initCharge: 'number?',
   consumeEvents: eventSeriesAssertion.orNull()
}

const rechargeableItemAssertion = {
   ...storeItemBaseAssertion,
   kind: 'string'.assertValue('rechargeable'),
   initCharge: 'number?',
   maxCharge: 'number?',
   consumeEvents: eventSeriesAssertion.orNull()
}

const activeRelicItemAssertion = {
   ...storeItemBaseAssertion,
   kind: 'string'.assertValue('active_relic'),
   cooldown: 'number',
   activateEvents: eventSeriesAssertion.orNull()
}

const passiveRelicItemAssertion = {
   ...storeItemBaseAssertion,
   kind: 'string'.assertValue('passive_relic'),
   onAddedEvents: eventSeriesAssertion.orNull()
}

const tradableItemAssertion = {
   ...storeItemBaseAssertion,
   kind: 'string'.assertValue('tradable'),
   sellValue: 'number'
}

const storeItemsAssertion = {
   consumableItems: [consumableItemAssertion].orNull(),
   rechargeableItems: [rechargeableItemAssertion].orNull(),
   activeRelicItems: [activeRelicItemAssertion].orNull(),
   passiveRelicItems: [passiveRelicItemAssertion].orNull(),
   tradableItems: [tradableItemAssertion].orNull()
}

const ruleSetDescriptorAssertion = {
   ident: {
      author: 'string',
      moduleName: 'string'
   },
   description: 'string?',
   skillCategories: [].orNull(),
   activityCategories: ['string'].orNull(),
}

const ruleSetContentAssertion = {
   skills: [skillAssertion].orNull(),
   startups: [startupAssertion].orNull(),
   activities: [activityAssertion].orNull(),
   ascensionPerks: [ascensionPerkAssertion].orNull(),
   storeItems: storeItemsAssertion.orNull(),
   events: [eventAssertion].orNull(),
   modifiers: [modifierAssertion].orNull(),
   translations: {}.orNull()
}

const ruleSetAssertion = {
   highOrder: 'boolean'.assertValue(false).orNull(),
   descriptor: ruleSetDescriptorAssertion,
   content: ruleSetContentAssertion
}

const highOrderRuleSetAssertion = {
   highOrder: 'boolean'.assertValue(true),
   descriptor: ruleSetDescriptorAssertion,
   generator: 'function'
}

const moduleAssertion = ruleSetAssertion.sumWith(highOrderRuleSetAssertion)

module.exports = {
   activityAssertion,
   ascensionPerkAssertion,
   skillAssertion,
   startupAssertion,
   eventAssertion,
   modifierAssertion,

   ruleSetDescriptorAssertion,
   ruleSetContentAssertion,
   ruleSetAssertion,
   highOrderRuleSetAssertion,
   moduleAssertion
}

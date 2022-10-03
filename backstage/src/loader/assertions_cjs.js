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

const translatableAssertion = translationKeyAssertion.sumWith({
   template: translationKeyAssertion,
   args: 'object'
})

const attributesAssertion = {
   strength: 'number?',
   emotionalIntelligence: 'number?',
   intelligence: 'number?',
   memorization: 'number?',
   imagination: 'number?',
   charisma: 'number?'
}

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

const activityAssertion = {
   ...baseAssertion,

   category: 'string',
   level: 'number',

   output: {
      attributes: attributesAssertion.orNull(),
      talent: 'undefined',
      skillPoints: 'number?',
      pressure: 'number?',
      satisfactory: 'number?',
      money: 'number?'
   }.orNull(),
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
      attributes: attributesAssertion.orNull(),
   },
   output: {
      attributes: attributesAssertion
   }.orNull(),
   activities: [identAssertion].orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const startupAssertion = {
   ...baseAssertion,

   player: {
      attributes: attributesAssertion.orNull(),
      talent: attributesAssertion.orNull(),
      skillPoints: 'number?',
      pressure: 'number?',
      satisfactory: 'number?',
      money: 'number?'
   }.orNull(),
   events: eventSeriesAssertion.orNull(),
   modifier: identAssertion.orNull(),

   ...patchModeAssertion
}

const eventAssertion = {
   ident: identAssertion,
   event: 'function',

   ...patchModeAssertion
}

const attributeModifiersAssertion = {
   strength: 'object?',
   intelligence: 'object?',
   emotionalIntelligence: 'object?',
   memorization: 'object?',
   imagination: 'object?',
   charisma: 'object?'
}

const modifierAssertion = {
   ...baseAssertion,

   player: ({
      attributes: attributeModifiersAssertion.orNull(),
      talent: attributeModifiersAssertion.orNull(),

      skillPoints: 'object?',
      energy: 'object?',
      mentalHealth: 'object?',
      satisfactory: 'object?',
      money: 'object?',
      moneyPerTurn: 'object?'
   }).sumWith('function').orNull(),
   skillPointCost: 'object'.sumWith('function').orNull()
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

const ruleSetAssertion = {
   ident: {
      author: 'string',
      moduleName: 'string'
   },
   description: 'string?',

   skillCategories: [].orNull(),
   activityCategories: ['string'].orNull(),
   skills: [skillAssertion].orNull(),
   startups: [startupAssertion].orNull(),
   activities: [activityAssertion].orNull(),
   ascensionPerks: [ascensionPerkAssertion].orNull(),
   events: [eventAssertion].orNull(),
   modifiers: [modifierAssertion].orNull(),
   translations: {}.orNull()
}

module.exports = {
   activityAssertion,
   ascensionPerkAssertion,
   skillAssertion,
   startupAssertion,
   eventAssertion,
   modifierAssertion,

   ruleSetAssertion
}

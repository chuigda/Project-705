// noinspection JSUnresolvedFunction

const { enableChainAPI } = require('./util/type_assert')

enableChainAPI()

const identAssertion = 'string'.sumWith({
   author: 'string',
   moduleName: 'string',
   id: 'string'
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
   description: 'string?'
})

potentialExpressionArgumentsAssertion.push(potentialExpressionAssertion)

const baseAssertion = {
   ident: identAssertion,
   name: 'string',
   description: 'string?',
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
   events: (eventSeriesAssertion).orNull(),

   ...patchModeAssertion
}

const ascensionPerkAssertion = {
   ...baseAssertion,

   potential: [potentialExpressionAssertion].orNull(),
   modifier: {
      // TODO(rebuild): rework with modifier assertion
   }.orNull(),
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
   modifier: {
      // TODO(rebuild): rework with modifier assertion
   }.orNull(),

   ...patchModeAssertion
}

const eventAssertion = {
   ident: identAssertion,
   event: ['function'],

   ...patchModeAssertion
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
   translations: {}
}

module.exports = {
   activityAssertion,
   ascensionPerkAssertion,
   skillAssertion,
   startupAssertion,
   eventAssertion,

   ruleSetAssertion
}
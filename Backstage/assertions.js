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

const activityAssertion = {
   ident: identAssertion,
   name: 'string',
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
   ident: identAssertion,
   name: 'string',
   description: 'string?',

   potential: [potentialExpressionAssertion].orNull(),
   modifier: {
      costReductions: ('object').orNull()
   }.orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const skillAssertion = {
   ident: identAssertion,
   name: 'string',
   description: 'string?',
   category: 'string',
   potential: [identAssertion.sumWith(potentialExpressionAssertion)].orNull(),
   cost: {
      base: 'number',
      attributes: attributesAssertion.orNull(),
   },
   output: {
      attributes: attributesAssertion
   },
   activities: [identAssertion].orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const startupAssertion = {
   ident: identAssertion,
   name: 'string',
   description: 'string?',

   player: {
      attributes: attributesAssertion.orNull(),
      talent: attributesAssertion.orNull(),
      skillPoints: 'number?',
      pressure: 'number?',
      satisfactory: 'number?',
      money: 'number?'
   }.orNull(),
   events: eventSeriesAssertion.orNull(),

   ...patchModeAssertion
}

const eventAssertion = {
   ident: identAssertion,
   name: 'string?',
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
   events: [eventAssertion].orNull()
}

module.exports = {
   activityAssertion,
   ascensionPerkAssertion,
   skillAssertion,
   startupAssertion,
   eventAssertion,

   ruleSetAssertion
}

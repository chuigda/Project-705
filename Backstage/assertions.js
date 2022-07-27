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

let potentialExpressionAssertionPiece = {
   op: 'string',
   arguments: [/* potentialExpressionAssertion */]
}

const potentialExpressionAssertion = potentialExpressionAssertionPiece
.sumWith({
   op: 'function',
   description: 'string?',
   hook: 'string?'
})

potentialExpressionAssertionPiece.arguments.push(potentialExpressionAssertion)

const activityAssertion = {
   ident: identAssertion,
   name: 'string',
   category: 'string',
   level: 'number',

   gain: ({
      attributes: attributesAssertion.orNull(),
      talent: 'undefined',
      skillPoints: 'number?',
      pressure: 'number?',
      satisfactory: 'number?',
      money: 'number?'
   }).orNull()
}

const ascensionPerkAssertion = {
   ident: identAssertion,
   name: 'string',
   description: 'string?',

   potential: potentialExpressionAssertion.orNull(),
   modifier: ({
      costReductions: ('object').orNull()
   }).orNull(),
   events: (['function']).orNull()
}

const skillAssertion = {
   ident: identAssertion,
   name: 'string',
   description: 'string?',
   category: 'string',
   requirements: ['string'.sumWith(potentialExpressionAssertion)],
   cost: {
      base: 'number',
      attributes: attributesAssertion.orNull(),
   },
   gain: {
      attributes: attributesAssertion
   },
   activities: (['string']).orNull(),
   events: (['function']).orNull()
}

const eventAssertion = {
   kind: 'string'.chainWith(x => {
      return x === 'passive'
             || x === 'game_start'
             || x === 'turn_start'
             || x === 'turn_over'
             || x.startsWith('gain:')
             || x.startsWith('cascade:')
   }),
   ident: identAssertion,
   name: 'string?',
   event: 'function'
}

module.exports = {
   activityAssertion,
   ascensionPerkAssertion,
   skillAssertion,
   eventAssertion
}

const { skillId } = require('../exports')
const computePotential = (gameContext, potential) => {
   if (typeof potential.op === 'function') {
      return {
         type: 'custom',
         result: potential.op(gameContext),
         description: potential.description
      }
   } else {
      const resultPieces = []
      for (const argument of potential.arguments) {
         const piece = computePotential(gameContext, argument)
         resultPieces.push(piece)
      }

      let finalResult = undefined
      switch (potential.op) {
      case 'and':
         finalResult = resultPieces.find(({ result }) => !result) === undefined
         break
      case 'or':
         finalResult = resultPieces.find(({ result }) => result) !== undefined
         break
      case 'not':
         finalResult = resultPieces.find(({ result }) => result) === undefined
         break
      }

      return {
         type: 'logic_op',
         op: potential.op,
         result: finalResult,
         resultPieces
      }
   }
}

const computeSkillPotential = (gameContext, skillPotential) => {
   if (typeof skillPotential === 'string' || typeof skillPotential.id === 'string') {
      const absoluteSkillId = skillId(gameContext.scope, skillPotential)
      return {
         type: 'skill',
         result: !!gameContext.player.skills[absoluteSkillId],
         skillId: absoluteSkillId,
         skillName: gameContext.ruleSet.skills[absoluteSkillId].name
      }
   } else {
      return computePotential(gameContext, skillPotential)
   }
}

module.exports = {
   computePotential,
   computeSkillPotential
}

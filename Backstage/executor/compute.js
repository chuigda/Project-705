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

      let finalResult
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
      default:
         console.warn(`[W] [computePotential] invalid op: ${potential.op}`)
         finalResult = false
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

const computeSingleModifier = modifierSet => {
   let increase = 1.0
   let decrease = 1.0
   for (const { value: { increase: inc, decrease: dec } } of modifierSet) {
      if (inc) {
         increase += inc
      }

      if (dec) {
         decrease += dec
      }
   }

   if (increase <= 0) {
      increase = 0
   }
   if (decrease >= 0) {
      decrease = 0
   }

   return { increase, decrease }
}

const computeModifiers = gameContext => {
   const { modifiers } = gameContext

   const dimensions = [
      'strength',
      'intelligence',
      'emotionalIntelligence',
      'memorization',
      'imagination',
      'charisma'
   ]
   const computeDimensions = object => {
      const ret = {}
      for (const dimension of dimensions) {
         ret[dimension] = computeSingleModifier(object[dimension])
      }
      return ret
   }

   gameContext.computedModifiers = {
      player: {
         attributes: computeDimensions(modifiers.player.attributes),
         talent: computeDimensions(modifiers.player.talent),
         
         ...computeDimensions(['skillPoints', 'pressure', 'satisfactory', 'money'])
      }
   }
}

const computePotentialSkills = gameContext => {}
const computePotentialAscensionPerks = gameContext => {}

module.exports = {
   computePotential,
   computeSkillPotential,
   computeModifiers,
   computePotentialSkills,
   computePotentialAscensionPerks
}

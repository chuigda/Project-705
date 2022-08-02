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

const computeSkillCost = (gameContext, skillCost) => {
   if (!skillCost) {
      return 0
   }

   const { base, attributes } = skillCost
   let totalDiffRatio = 0.0
   for (const attrName in attributes) {
      const diff = gameContext.player.attributes[attrName] - attributes[attrName]
      if (diff < 0) {
         totalDiffRatio += -(diff / attributes[attrName])
      }
   }
   totalDiffRatio *= 3.0
   if (totalDiffRatio > 10.0) {
      totalDiffRatio = 10.0
   }

   let cost = base * (1.0 + totalDiffRatio)
   if (cost > 999) {
      cost = 999
   }
   return Math.floor(cost)
}

const computePotentialSkills = gameContext => {
   const { skills: allSkills } = gameContext.ruleSet
   const { skills } = gameContext.player

   for (const skill of allSkills) {
      const { ident, potential } = skill
      if (skills[ident]) {
         continue
      }

      const resultPieces = []
      for (const potentialPart of potential) {
         resultPieces.push(computeSkillPotential(gameContext, potentialPart))
      }
      const result = !resultPieces.find(({ result }) => !result)

      if (result) {
         gameContext.computedSkills.available[ident] = {
            skill,
            cost: computeSkillCost(gameContext, skill)
         }
      } else {
         gameContext.computedSkills.unavailable[ident] = {
            ident,
            skill,
            resultPieces
         }
      }
   }
}

const computePotentialAscensionPerks = gameContext => {
   const { ascensionPerks: allAscensionPerks } = gameContext.ruleSet
   const { ascensionPerks } = gameContext.player

   for (const ascensionPerk of allAscensionPerks) {
      const { ident, potential } = ascensionPerk
      if (ascensionPerks[ident]) {
         continue
      }

      const resultPieces = potential.map(potentialPart => computePotential(gameContext, potentialPart))
      const result = !resultPieces.find(({ result }) => !result)

      if (result) {
         gameContext.computedAscensionPerks.available[ident] = {
             ascensionPerk,
             cost: computeSkillCost(gameContext, ascensionPerk)
         }
      } else {
         gameContext.computedAscensionPerks.unavailable[ident] = {
             ident,
             ascensionPerk,
             resultPieces
         }
      }
   }
}

module.exports = {
   computePotential,
   computeSkillPotential,
   computeModifiers,
   computeSkillCost,
   computePotentialSkills,
   computePotentialAscensionPerks
}

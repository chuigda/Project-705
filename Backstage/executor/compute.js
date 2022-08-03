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
   if (!modifierSet) {
      return { increase, decrease }
   }

   for (const { value: { increase: inc, decrease: dec } } of Object.values(modifierSet)) {
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
   if (decrease <= 0) {
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
   if (!skillCost || !skillCost.base) {
      return 0
   }

   const { base, attributes } = skillCost
   console.debug(`[D] [computeSkillCost] base cost = ${base}, attributes = ${attributes}`)
   let totalDiffRatio = 0.0
   if (attributes) {
      for (const attrName in attributes) {
         const diff = gameContext.player.attributes[attrName] - attributes[attrName]
         console.debug(`[D] [computeSkillCost] gameContext.player.attributes[${attrName}]`
                       + `= ${gameContext.player.attributes[attrName]}`
                       + `, attributes[${attrName}] = ${attributes[attrName]}`
                       + `, diff = ${diff}`)
         if (diff < 0) {
            totalDiffRatio += -(diff / attributes[attrName])
            console.debug(`[D] [computeSkillCost] diff contribution = ${-(diff / attributes[attrName])}`)
         }
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
   gameContext.computedSkills = {
      available: {},
      unavailable: {}
   }

   const { skills: allSkills } = gameContext.ruleSet
   const { skills } = gameContext.player

   for (const skill of Object.values(allSkills)) {
      const { ident, potential } = skill
      if (skills[ident]) {
         console.info(`[I] [computePotentialSkills] skipping already learned skill: '${ident}'`)
         continue
      }

      let result = true
      const resultPieces = []
      if (potential) {
         for (const potentialPart of potential) {
            resultPieces.push(computeSkillPotential(gameContext, potentialPart))
         }
         result = !resultPieces.find(({ result: r }) => !r)
      }

      if (result) {
         const cost = computeSkillCost(gameContext, skill.cost)
         console.info(`[I] [computePotentialSkills] skill '${ident}' available, it costs: ${cost}`)
         gameContext.computedSkills.available[ident] = {
            skill,
            cost
         }
      } else {
         console.info(`[I] [computePotentialSkills] skill '${ident}' not available`)
         gameContext.computedSkills.unavailable[ident] = {
            ident,
            skill,
            resultPieces
         }
      }
   }
}

const recomputeSkillCosts = gameContext => {
   for (const skillCostObject of Object.values(gameContext.computedSkills.available)) {
      const { skill } = skillCostObject
      const { ident } = skill
      const cost = computeSkillCost(gameContext, skill.cost)
      console.info(`[I] [recomputeSkillCosts] skill '${ident}' costs ${cost}`)
      skillCostObject.cost = cost
   }
}

const computePotentialAscensionPerks = gameContext => {
   gameContext.computedAscensionPerks = {
      available: {},
      unavailable: {}
   }

   const { ascensionPerks: allAscensionPerks } = gameContext.ruleSet
   const { ascensionPerks } = gameContext.player

   for (const ascensionPerk of Object.values(allAscensionPerks)) {
      const { ident, potential } = ascensionPerk
      if (ascensionPerks[ident]) {
         console.info(`[I] [computePotentialAscensionPerks] skipping already activated ascension perk: '${ident}'`)
         continue
      }

      let result = true
      let resultPieces = []
      if (potential) {
         resultPieces = potential.map(potentialPart => computePotential(gameContext, potentialPart))
         result = !resultPieces.find(({ result: r }) => !r)
      }

      console.info(`[I] [computePotentialAscensionPerks] computed ascension perk '${ident}': ${result}`)
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
   recomputeSkillCosts,
   computePotentialAscensionPerks
}

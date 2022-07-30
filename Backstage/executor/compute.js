const computePotential = (gameContext, potential) => {
   if (typeof potential.op === 'function') {
      return {
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
         op: potential.op,
         result: finalResult,
         resultPieces
      }
   }
}

module.exports = {
   computePotential
}

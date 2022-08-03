const updatePlayerProperty = (gameContext, property, operator, value, source) => {
   // TODO(rebuild): 暂时只计算 events，但如何计算 modifiers?
   const opRef = { operator, value }
   const propertyPath = property.split['.']
   let container = gameContext.events.playerPropertyUpdated
   let propertyContainer = gameContext.player
   let lastPropertyPath = null
   for (const pathPartIdx in propertyPath) {
      const pathPart = propertyPath[pathPartIdx]
      if (container.all) {
         for (const event of container.all) {
            for (const eventFunction of event.event) {
               eventFunction(gameContext, opRef, source)
            }
         }
      }
      container = container[pathPart]
      if (pathPartIdx !== propertyPath.length - 1) {
         propertyContainer = propertyContainer[pathPart]
         lastPropertyPath = pathPart
      }
   }

   if (!Array.isArray(container)) {
      console.warn(`[W] [updatePlayerProperty] invalid property path: '${property}'`)
      return
   }

   for (const event of container) {
      for (const eventFunction of event.event) {
         eventFunction(gameContext, opRef, source)
      }
   }

   switch (opRef.operator) {
   case 'add':
      propertyContainer[lastPropertyPath] += opRef.value
      break
   case 'sub':
      propertyContainer[lastPropertyPath] -= opRef.value
      break
   case 'set':
      propertyContainer[lastPropertyPath] = opRef.value
      break
   case 'mul':
      propertyContainer[lastPropertyPath] *= opRef.value
      break
   default:
      console.warn(`[W] [updatePlayerProperty] invalid operator '${opRef.operator}'`)
   }
}

module.exports = {
   updatePlayerProperty
}

import json5 = require('json5')

function mapObject(object: string | object): string | object {
   if (typeof object === 'function') {
      return ' +*+ [ +*+ Function Code *+* ] +*+ '
   } else if (Array.isArray(object)) {
      return object.map(mapObject)
   } else if (typeof object === 'object') {
      const result = {}
      for (const key in object) {
         // @ts-ignore
         result[key] = mapObject(object[key])
      }
      return result
   } else {
      return object
   }
}

export function perfectStringify(object: string| object): string {
   return json5.stringify(mapObject(object), { space: 3 })
      .replaceAll('\' +*+ [ +*+ Function Code *+* ] +*+ \'', '(gameContext, ...) => { ... }')
      .replaceAll('" +*+ [ +*+ Function Code *+* ] +*+ "', '(gameContext, ...) => { ... }')
}

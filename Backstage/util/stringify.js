const JSON5 = require('json5')

const mapObject = object => {
   if (typeof object === 'function') {
      return '[Function Code]'
   } else if (Array.isArray(object)) {
      return object.map(mapObject)
   } else if (typeof object === 'object') {
      const result = {}
      for (const key in object) {
         result[key] = mapObject(object[key])
      }
      return result
   } else {
      return object
   }
}

const perfectStringify = object => JSON5.stringify(mapObject(object), { space: 3 })

module.exports = { perfectStringify }

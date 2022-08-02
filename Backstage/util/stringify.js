const JSON5 = require('json5')

const mapObject = object => {
   if (typeof object === 'function') {
      return ' +*+ [ +*+ Function Code *+* ] +*+ '
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

const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace)

const perfectStringify = object => {
   let v = JSON5.stringify(mapObject(object), { space: 3 })
   v = replaceAll(v, '\' +*+ [ +*+ Function Code *+* ] +*+ \'', '(gameContext, ...) => { ... }')
   v = replaceAll(v, '\" +*+ [ +*+ Function Code *+* ] +*+ \"', '(gameContext, ...) => { ... }')
   return v
}

module.exports = { perfectStringify }

export function cloneObject<T>(source: T): T {
   return { ...source }
}

export function deepCloneObject<T>(source: T): T {
   return JSON.parse(JSON.stringify(source))
}

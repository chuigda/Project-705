export function rand(min: number, max: number): number {
   return min + Math.random() * (max - min)
}

export function randInt(minOrMax: number, max?: number): number {
   if (max === undefined) { // from 0 to minOrMax
      return Math.floor(Math.random() * minOrMax)
   }
   return Math.floor(rand(minOrMax, max))
}

export function randChoose<T>(arr: T[]): T {
   return arr[randInt(arr.length)]
}

export function randProp(obj: Record<string, any>): string {
   const keys = Object.keys(obj)
   return randChoose(keys)
}

export function randPropValue<V>(obj: Record<string, V>): V {
   return obj[randProp(obj)]
}

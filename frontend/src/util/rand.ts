export function rand(min: number, max: number): number {
   return min + Math.random() * (max - min)
}

export function randInt(min: number, max: number): number {
   return Math.floor(rand(min, max))
}

export function randChoose<T>(arr: T[]): T {
   if (arr.length === 0) {
      throw new Error('从空数组中“随机选取”是严重的逻辑错误，将会导致游戏崩溃')
   }

   return arr[randInt(0, arr.length)]
}

export function randProp(obj: Record<string, any>): string {
   const keys = Object.keys(obj)
   return randChoose(keys)
}

export function randPropValue<V>(obj: Record<string, V>): V {
   const propName = randProp(obj)
   return obj[propName]
}

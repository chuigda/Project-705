import { panic } from './emergency'

export function rand(min: number, max: number): number {
   return min + Math.random() * (max - min)
}

export function randInt(min: number, max: number): number {
   return Math.floor(rand(min, max))
}

function randChooseDebug<T>(arr: T[]): T {
   if (arr.length === 0) {
      panic('randomly choosing from an empty array could completely fuck the program up')
   }
   return arr[randInt(0, arr.length)]
}

function randChooseRelease<T>(arr: T[]): T {
   return arr[randInt(0, arr.length)]
}

export const randChoose = process.env.DEBUG ? randChooseDebug : randChooseRelease

export function randProp(obj: Record<string, any>): string {
   const keys = Object.keys(obj)
   return randChoose(keys)
}

export function randPropValue<V>(obj: Record<string, V>): V {
   const propName = randProp(obj)
   return obj[propName]
}

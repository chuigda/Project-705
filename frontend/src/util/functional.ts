export function curry<T, ARGS, R>(f: (first: T, ...last: ARGS[]) => R, first: T): (...args: ARGS[]) => R {
   return (...args: ARGS[]) => {
      return f(first, ...args)
   }
}

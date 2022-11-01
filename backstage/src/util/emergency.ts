export function abort(): never {
   console.error('[!] an unrecoverable error has occurred, aborting process')
   process.abort()
}

export function panic(reason: string): never {
   console.error(`[E] program panicked because: ${reason}`)
   abort()
}

export function assert(condition: boolean, failText?: string) {
   if (!condition) {
      panic(failText ?? 'assertion failed')
   }
}

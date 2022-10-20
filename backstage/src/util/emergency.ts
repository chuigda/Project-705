export function abort(): never {
   console.error('[!] an unrecoverable error has occurred, aborting process')
   process.abort()
}

export function panic(reason: string): never {
   console.error(`[E] program panicked because: ${reason}`)
   abort()
}

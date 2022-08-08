export function abort(): never {
   console.error('[!] an unrecoverable error has occurred, aborting process')
   process.abort()
}

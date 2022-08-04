const abort = () => {
   console.error('[!] an unrecoverable error has occurred, aborting process')
   process.abort()
}

module.exports = {
   abort
}

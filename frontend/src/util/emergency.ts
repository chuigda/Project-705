import { setLocalStorage } from '@app/util/local_storage'

export function pullup(errCode: number, errMessage: string, errDetail?: string) {
   const fancyMessage = errMessage.toUpperCase().replaceAll(' ', '_')

   setLocalStorage('errorReport:errCode', `${errCode}`)
   setLocalStorage('errorReport:errMessage', fancyMessage)
   setLocalStorage('errorReport:errDetail', errDetail)
   window.location.replace('/#/error')
}

export function dontSink(errDetail?: string) {
   setLocalStorage('errorReport:errCode', '1143')
   setLocalStorage('errorReport:errMessage', 'SIGUSR1')
   setLocalStorage('errorReport:errDetail', errDetail)
   window.location.replace('/#/error')
}

import { setLocalStorage } from '@app/util/local_storage'

export async function getJsonRequest<T>(url: string, params?: Record<string, string>): Promise<T> {
   let r
   if (params) {
      r = await fetch(`${url}?${new URLSearchParams(params)}`)
   } else {
      r = await fetch(`${url}`)
   }

   if (!r.ok) {
      setLocalStorage('errorReport:errCode', `${r.status}`)
      setLocalStorage('errorReport:errMessage', r.statusText)
      window.location.replace('/#/error')
   }
   return await r.json()
}

export async function postJsonRequest<T>(url: string, jsonObject?: object): Promise<T> {
   jsonObject = jsonObject || {}

   const r = await fetch(url, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonObject)
   })

   if (!r.ok) {
      setLocalStorage('errorReport:errCode', `${r.status}`)
      setLocalStorage('errorReport:errMessage', r.statusText)
      window.location.replace('/#/error')
   }
   return await r.json()
}

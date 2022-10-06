import {setLocalStorage} from '@app/util/local_storage'

const globalHeaders: Record<string, string> = {}

export function setGlobalHeader(header: string, value?: string) {
   if (!value) {
      delete globalHeaders[header]
   } else {
      globalHeaders[header] = value
   }
}

async function maybeHandleError(r: Response) {
   if (!r.ok) {
      let detail
      try {
         const body = await r.json()
         if (body && body.message) {
            detail = <string>body.message
         }
      } catch (e) {
         // do nothing, just fill empty detail
      }

      setLocalStorage('errorReport:errCode', `${r.status}`)
      setLocalStorage('errorReport:errMessage', r.statusText.toUpperCase().replaceAll(' ', '_'))
      setLocalStorage('errorReport:errDetail', detail)
      window.location.replace('/#/error')
   }
}

export async function getJsonRequest<T>(
   url: string,
   params?: Record<string, string>,
   headers?: Record<string, string>
): Promise<T> {
   const init = {
      method: 'GET',
      headers: {
         'Accept': 'application/json',
         ...globalHeaders,
         ...headers
      }
   }

   let r
   if (params) {
      r = await fetch(`${url}?${new URLSearchParams(params)}`, init)
   } else {
      r = await fetch(`${url}`, init)
   }

   await maybeHandleError(r)
   return await r.json()
}

export async function postJsonRequest<T>(
   url: string,
   jsonObject?: object,
   headers?: Record<string, string>
): Promise<T> {
   jsonObject = jsonObject || {}

   const r = await fetch(url, {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         ...globalHeaders,
         ...headers
      },
      body: JSON.stringify(jsonObject)
   })

   await maybeHandleError(r)
   return await r.json()
}

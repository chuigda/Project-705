export async function httpGet<T>(
   uri: string,
   params?: Record<string, string>,
   responder?: (resp: Response) => Promise<T>
): Promise<T> {
   responder = responder ?? (resp => resp.json())

   const r = await fetch(`${uri}?${new URLSearchParams(params)}`)
   return await responder(r)
}

export async function httpPost<T>(
   uri: string,
   params?: Record<string, string>,
   body?: Record<string, string>,
   responder?: (resp: Response) => Promise<T>
): Promise<T> {
   responder = responder ?? (resp => resp.json())

   const r = await fetch(`${uri}?${new URLSearchParams(params)}`, {
      method: 'POST',
      body: JSON.stringify(body)
   })
   return await responder(r)
}

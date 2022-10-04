import { IStartup } from '@protocol/index'

export async function getStartups(): Promise<IStartup[]> {
   const r = await fetch('/api/startups', { method: 'GET' })
   const { success, message, result } = await r.json()
   if (!success) {
      // TODO 遇到致命错误
      console.error(message)
      return []
   }

   return <IStartup[]>result
}

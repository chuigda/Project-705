import { IResponse, IStartup, ITranslation } from '@protocol/index'
import { getJsonRequest } from '@app/util/mebius'

export async function getStartups(): Promise<IStartup[]> {
   const { success, message, result } = await getJsonRequest<IResponse<IStartup[]>>('/api/startups')
   if (!success) {
      // TODO 遇到致命错误
      console.error(message)
      return []
   }

   return result
}

export async function getTranslation(lang: string): Promise<ITranslation> {
   const { success, message, result } = await getJsonRequest<IResponse<ITranslation>>('/api/translation', {lang })
   if (!success) {
      // TODO 遇到致命错误
      console.error(message)
      return {}
   }

   return result
}

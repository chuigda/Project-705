import { IGameState, IResponse, IStartup, ITranslation } from '@protocol/index'
import { getJsonRequest, postJsonRequest, setGlobalHeader } from '@app/util/mebius'
import { dontSink } from '@app/util/emergency'
import { setLocalStorage } from '@app/util/local_storage'

export function setUserToken(token: string) {
   setLocalStorage('session:userToken', token)
   setGlobalHeader('X-Access-Token', token)
}

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

export async function startNewGame(startupId: string) {
   const { success, message } = await postJsonRequest<IResponse<void>>('/api/new_game', { startupId })
   if (!success) {
      dontSink(message)
   }
}

export async function getSnapshot(): Promise<IGameState> {
   const { success, message, result } = await getJsonRequest<IResponse<IGameState>>('/api/snapshot')
   if (!success) {
      dontSink(message)
   }

   return result
}

import {IGameState, IResponse, IResponseFail} from '@protocol/index'
import {postJsonRequest} from '@app/util/mebius'

let debugToken: string | undefined = undefined

export function setDebugToken(token: string) {
   debugToken = token
}

function debugTokenHeader(): Record<string, string> {
   return { 'X-Debugger-Auth-Token': debugToken! }
}

export async function debugInitGame(startupId: string): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/init',
      { startupId },
      debugTokenHeader()
   )
}

export async function debugAddActivity(activityId: string): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/add_activity',
      { activityId },
      debugTokenHeader()
   )
}

export async function debugAscension(ascensionPerkId: string, force?: boolean): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/activate_ascension_perk',
      { ascensionPerkId, force },
      debugTokenHeader()
   )
}

export async function debugCrash(): Promise<IResponseFail> {
   return await postJsonRequest<IResponseFail>(
      '/api/debug/crash',
      undefined,
      debugTokenHeader()
   )
}

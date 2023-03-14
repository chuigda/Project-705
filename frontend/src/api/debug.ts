import { IGameState, IResponse, IResponseFail } from '@protocol/index'
import { postJsonRequest } from '@app/util/mebius'

export async function debugInitGame(startupId: string): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/init',
      { startupId }
   )
}

export async function debugAddActivity(activityId: string): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/add_activity',
      { activityId }
   )
}

export async function debugAscension(ascensionPerkId: string, force?: boolean): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/activate_ascension_perk',
      { ascensionPerkId, force }
   )
}

export async function debugUpdateProperty(property: string, op: string, value: number): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/property',
      { property, op, value }
   )
}
export async function debugTriggerEvent(event: string, args:any[]): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>(
      '/api/debug/trigger_event',
      { event, args }
   )
}
export async function debugCrash(): Promise<IResponseFail> {
   return await postJsonRequest<IResponseFail>('/api/debug/crash')
}

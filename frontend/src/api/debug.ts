import {IGameState, IResponse, IResponseFail} from '@protocol/index'
import {postJsonRequest} from '@app/util/mebius'

export async function debugAddActivity(activityId: string): Promise<IResponse<IGameState>> {
   return await postJsonRequest<IResponse<IGameState>>('/api/debug/add_activity', { activityId })
}

export async function debugCrash(): Promise<IResponseFail> {
   return await postJsonRequest<IResponseFail>('/api/debug/crash')
}

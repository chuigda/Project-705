import {IPlayerStatus} from '@protocol/player'

export function patchPlayerStatus(playerStatus: IPlayerStatus, delta: IPlayerStatus): IPlayerStatus {
   const ret = {}
   for (const key in playerStatus) {
      if (delta[<keyof IPlayerStatus>key] !== undefined) {
         // @ts-ignore
         ret[key] = delta[key]
      } else {
         // @ts-ignore
         ret[key] = playerStatus[key]
      }
   }
   return ret
}

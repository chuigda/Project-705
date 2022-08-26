import { GameContext } from '@app/executor/game_context'
import serverStore from '@app/server/store'
import { v4 as uuid } from 'uuid'

export default function epInit(accessToken?: string): { gameContext: GameContext; accessToken: string } {
   if (!accessToken) accessToken = uuid()
   const ctx = serverStore.initGame(accessToken)
   return { gameContext: ctx, accessToken }
}

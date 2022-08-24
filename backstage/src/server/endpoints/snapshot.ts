import { GameContext } from '@app/executor/game_context'
import serverStore from '@app/server/store'

export default function epGetSnapshot(accessToken?: string): GameContext | undefined {
   if (!accessToken) return undefined
   return serverStore.getGame(accessToken)
}

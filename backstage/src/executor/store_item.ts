import { GameContext } from '@app/executor/game_context'
import { Ident } from '@app/base/uid'

export function giveStoreItem(gameContext: GameContext, storeItemId: Ident, count?: number) {}

export function purchaseStoreItem(gameContext: GameContext, storeItemId: Ident) {}

export function sellStoreItem(gameContext: GameContext, storeItemId: Ident, count?: number) {}

export function useStoreItem(gameContext: GameContext, storeItemId: Ident, count?: number) {}

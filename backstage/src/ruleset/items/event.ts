import { Ident, Scope } from '@app/base/uid'
import { GameContext } from '@app/executor/game_context'

export type EventFunction = (gameContext: GameContext, ...args: any[]) => void

export class Event {
   readonly ident: Ident
   readonly scope?: Scope
   readonly event: EventFunction
}

export type MaybeInlineEvent = Ident | EventFunction

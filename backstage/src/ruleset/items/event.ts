import { Ident, Scope } from '../../base/uid'
import { GameContext } from '../../executor/game_context'

export type EventFunction = (gameContext: GameContext, ...args: any[]) => void

export class Event {
   readonly ident: Ident
   readonly scope?: Scope
   readonly event: EventFunction[] // TODO: rename to events

   constructor(ident: Ident, event: EventFunction[], scope?: Scope) {
      this.ident = ident
      this.event = event
      this.scope = scope
   }
}

export type MaybeInlineEvent = Ident | EventFunction

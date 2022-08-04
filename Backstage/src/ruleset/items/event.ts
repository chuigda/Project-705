import { Ident } from '../../base/uid'
import { GameContext } from '../../executor/game_context'

export type EventFunction = (gameContext: GameContext, ...args: any[]) => void

export class Event {
   readonly ident: Ident
   readonly event: EventFunction[]

   constructor(ident: Ident, event: EventFunction[]) {
      this.ident = ident
      this.event = event
   }
}

export type MaybeInlineEvent = Ident | EventFunction

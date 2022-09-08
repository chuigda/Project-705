import { Event } from '@app/ruleset'
import { GameContext } from '@app/executor/game_context'

const wellPreparedActivation: Event = {
   ident: 'well_prepared_activation',
   event: [
      (gameContext: GameContext) => {
         gameContext.updatePlayerProperty('skillPoints', 'add', 500)
      }
   ]
}

const syntheicEvolutionActivation: Event = {
   ident: 'synthetic_evolution_activation',
   event: [
      (gameContext: GameContext) => {
         // TODO
      }
   ]
}

export default [
   wellPreparedActivation,
   syntheicEvolutionActivation
]

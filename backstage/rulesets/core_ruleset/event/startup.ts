// detroit event scripts
import { GameContext } from '@app/executor/game_context'

const detroitEvents = [
   {
      ident: 'detroit_init',
      event: [
         (gameContext: GameContext) => {
            gameContext.connect(gameContext.signals.timer(8), 'detroit_add_attr1')
            gameContext.connect(gameContext.signals.timer(24), 'detroit_add_attr2')
            gameContext.connect(gameContext.signals.timer(40), 'detroit_add_attr3')

            gameContext.setV('data_collected', 0)
            gameContext.setV('software_unstable', 0)
            gameContext.setV('program_error', 0)
         }
      ]
   },
   {
      ident: 'detroit_add_attr1',
      event: [
         (gameContext: GameContext) => {
            // not using `updatePlayerProperties` here because we don't want to be hooked
            gameContext.state.player.attributes.intelligence += 2000
            gameContext.state.player.attributes.emotionalIntelligence += 500
            gameContext.state.player.attributes.strength += 500
            gameContext.state.player.attributes.imagination += 250
         }
      ]
   },
   {
      ident: 'detroit_add_attr2',
      event: [
         (gameContext: GameContext) => {
            gameContext.state.player.attributes.intelligence += 4000
            gameContext.state.player.attributes.emotionalIntelligence += 500
            gameContext.state.player.attributes.strength += 1000
            gameContext.state.player.attributes.imagination += 250
         }
      ]
   }
]

export default [
   ...detroitEvents
]

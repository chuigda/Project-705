import { CompiledRuleSet, load } from '@app/loader'
import initGame from '@app/loader/init'
import { GameContext } from '@app/executor/game_context'
import { assert, } from '@app/util/emergency'

function startGame(): GameContext {
   const ruleSet: CompiledRuleSet = load()

   const gameContext = initGame(ruleSet, '@cnpr:dbg:st:debug')
   assert(!!gameContext, 'gameContext == null')

   return gameContext!
}

export default startGame

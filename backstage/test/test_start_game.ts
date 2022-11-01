import { nextTurn } from '@app/executor/turn'
import { CompiledRuleSet, load } from '@app/loader'
import initGame from '@app/loader/init'

const ruleSet: CompiledRuleSet = load()

const gameContext = initGame(ruleSet, '@cnpr:dbg:st:debug')
if (!gameContext) {
   throw new Error('gameContext == null')
}

const [success] = nextTurn(gameContext)
if(!success) {
   throw new Error('nextTurn failed')
}

console.info('Start game test OK')

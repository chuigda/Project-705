import { nextTurn } from '@app/executor/turn'
import startGame from '@test/base/start_game'
import { assert } from '@app/util/emergency'

const gameContext = startGame()

const [success] = nextTurn(gameContext)
assert(success, 'nextTurn failed')

console.info('Start game test OK')

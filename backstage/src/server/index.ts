import express = require('express')

import epInitGame from '@app/server/endpoints/init'
import epNextTurn from '@app/server/endpoints/next_turn'
import epLearnSkill from '@app/server/endpoints/skill'
import epSendSnapshot from '@app/server/endpoints/snapshot'
import epGetTranslation from '@app/server/endpoints/translation'
import epActivateAscensionPerk from '@app/server/endpoints/ascension_perk'
import epGetStartups from '@app/server/endpoints/startup'
import epMapMove from '@app/server/endpoints/map_move'
import { epPurchaseItem, epUseItem } from '@app/server/endpoints/store_item'
import debugRouter from '@app/server/endpoints/debug'
import { validateAccessToken, validateGameContext } from '@app/server/middleware'

function applicationStart() {
   const app = express()

   app.use(express.json())

   app.post('/api/new_game', validateAccessToken, epInitGame)

   app.get('/api/snapshot', validateGameContext, epSendSnapshot)

   app.post('/api/next_turn', validateGameContext, epNextTurn)

   app.post('/api/learn_skill', validateGameContext, epLearnSkill)

   app.post('/api/ascension', validateGameContext, epActivateAscensionPerk)

   app.post('/api/purchase_item', validateGameContext, epPurchaseItem)

   app.post('/api/use_item', validateGameContext, epUseItem)

   app.post('/api/map_move', validateGameContext, epMapMove)

   app.get('/api/startups', epGetStartups)

   app.get('/api/translation', epGetTranslation)

   app.use('/api/debug', debugRouter)

   app.listen(3000, 'localhost', () => console.info('application started'))
}

export default applicationStart

import express = require('express')
import serverStore from '@app/server/store'
import ruleSet from '@app/server/ruleset'

function applicationStart() {
   const app = express()

   app.post('/api/init', (req, res) => {
      const accessToken = req.header('X-Fe-Access-Token')
      const context = serverStore.initGame(accessToken)
      res.json(context)
   })

   app.get('/api/translation', (req, res) => {
      const { query } = req
      const { lang } = query

      if (lang && typeof lang === 'string') {
         res.json({
            success: true,
            result: ruleSet.translations[lang] || {}
         })
      } else {
         res.sendStatus(400)
      }
   })

   app.listen(3000, () => console.log('application started'))
}

export default applicationStart

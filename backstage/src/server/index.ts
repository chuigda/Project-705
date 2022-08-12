import express = require('express')
import serverStore from '@app/server/store'

function applicationStart() {
   const app = express()

   app.post('/init', (req, res) => {
      const accessToken = req.header('X-Fe-Access-Token')
      const context = serverStore.initGame(accessToken)
      res.json(context)
   })

   app.listen(3000, () => console.log('application started'))
}

export default applicationStart

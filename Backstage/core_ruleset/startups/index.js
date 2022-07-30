const normalStartup = {
   ident: 'normal',
   name: '$startup_normal',
   description: '$startup_normal_desc'
}

const giftedStartup = {
   ident: 'gifted',
   name: '$startup_gifted',
   description: '$startup_gifted_desc',

   player: {
      talent: {
         strength: 100,
         intelligence: 100,
         emotionalIntelligence: 100,
         memorization: 100,
         imagination: 100
      },
      skillPoints: 500,
   }
}

module.exports = [
   normalStartup,
   giftedStartup
]

const walk = {
   ident: 'walk',

   name: '$skill_walk',
   category: 'init_skills',
   cost: {
      base: 100
   },
   gain: {
      attributes: {
         strength: 50
      }
   },
   activities: ['walk']
}

const run = {
   ident: 'run',

   name: '$skill_run',
   description: '$skill_run_desc',
   category: 'init_skills',
   requirements: ['walk'],
   cost: {
      base: 40,
      attributes: {
         strength: 200
      }
   },
   gain: {
      attributes: {
         strength: 100
      }
   },
   activities: ['run']
}

const speak = {
   ident: 'speak',

   name: '$skill_speak',
   category: 'init_skills',
   requirements: ['walk'],
   cost: {
      base: 20,
      attributes: {
         emotionalIntelligence: 0
      }
   },
   gain: {
      attributes: {
         emotionalIntelligence: 50
      }
   },
   activities: ['speak']
}

const tolerance = {
   ident: 'tolerance',

   name: '$skill_tolerance',
   description: '$skill_tolerance_desc',
   category: 'init_skills',
   requirements: ['speak'],
   cost: {
      base: 40,
      attributes: {
         emotionalIntelligence: 100
      }
   },
   gain: {
      attributes: {
         emotionalIntelligence: 50,
         charisma: 40
      }
   },
   activities: ['speak']
}

module.exports = [
   // sports
   walk,
   run,

   // personalities
   speak,
   tolerance
]

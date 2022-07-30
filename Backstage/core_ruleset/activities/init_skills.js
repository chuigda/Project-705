const crawl = {
   ident: 'crawl',

   name: '$activity_crawl',
   category: 'sports',
   level: 0,
   output: {
      attributes: {
         strength: 4
      }
   }
}

const walk = {
   ident: 'walk',

   name: '$activity_walk',
   category: 'sports',
   level: 1,

   output: {
      attributes: {
         strength: 6
      }
   }
}

const run = {
   ident: 'run',

   name: '$activity_run',
   category: 'sports',
   level: 2,

   output: {
      attributes: {
         strength: 8
      }
   }
}

const speak = {
   ident: 'speak',

   name: '$activity_speak',
   category: 'personality',
   level: 1,

   output: {
      attributes: {
         emotionalIntelligence: 4
      }
   }
}

const tolerance = {
   ident: 'tolerance',

   name: '$activity_tolerance',
   category: 'personality',
   level: 2,

   output: {
      attributes: {
         emotionalIntelligence: 8,
         charisma: 4,
      }
   }
}

module.exports = [
   crawl,
   walk,
   run,
   speak,
   tolerance
]

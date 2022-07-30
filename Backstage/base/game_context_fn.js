const signals = {
   turnStart: () => 'turn_start',
   turnOver: () => 'turn_over',
   playerPropertyUpdated: property => ({
      signalType: 'player',
      property,
   }),
   skillLearnt: () => 'skill_learnt'
}

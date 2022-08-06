const compileRuleSet = (ruleSet, newRuleSet) => {
   const {
      ident: ruleSetIdent,
      skillCategories,
      activityCategories,
      skills,
      startups,
      activities,
      ascensionPerks,
      events,
      translations
   } = newRuleSet
   const { author, moduleName } = ruleSetIdent
   console.info(`[I] [compileRuleSet] Compiling rule set ${author}:${moduleName}`)

   if (skillCategories) {
      compileSkillCategories(ruleSet, ruleSetIdent, skillCategories)
   }

   if (activityCategories) {
      compileActivityCategories(ruleSet, activityCategories)
   }

   if (skills) {
      compileSkills(ruleSet, ruleSetIdent, skills)
   }

   if (startups) {
      compileStartups(ruleSet, ruleSetIdent, startups)
   }

   if (activities) {
      compileActivities(ruleSet, ruleSetIdent, activities)
   }

   if (ascensionPerks) {
      compileAscensionPerks(ruleSet, ruleSetIdent, ascensionPerks)
   }

   if (events) {
      compileEvents(ruleSet, ruleSetIdent, events)
   }

   if (translations) {
      compileTranslations(ruleSet, ruleSetIdent, translations)
   }
}

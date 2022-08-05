// TODO(chuigda): fill these things

export class PotentialResult {}

export class AvailableSkill {}

export class UnavailableSkill {}

export class ComputedSkills {
   readonly available: Record<string, AvailableSkill>
   readonly unavailable: Record<string, UnavailableSkill>

   constructor(available: Record<string, AvailableSkill>, unavailable: Record<string, UnavailableSkill>) {
      this.available = available
      this.unavailable = unavailable
   }
}

export class AvailableAscensionPerk {}

export class UnavailableAscensionPerk {}

export class ComputedAscensionPerks {
   readonly available: Record<string, AvailableAscensionPerk>
   readonly unavailable: Record<string, UnavailableAscensionPerk>

   constructor(available: Record<string, AvailableAscensionPerk>, unavailable: Record<string, UnavailableAscensionPerk>) {
      this.available = available
      this.unavailable = unavailable
   }
}

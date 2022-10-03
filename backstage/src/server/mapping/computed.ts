import {
   AvailableSkill,
   ComputedAscensionPerks,
   ComputedSkills,
   UnavailableAscensionPerk,
   UnavailableSkill
} from '@app/executor/compute'
import {
   IAvailableSkill,
   IComputedAscensionPerks,
   IComputedSkills,
   IUnavailableAscensionPerk,
   IUnavailableSkill
} from '@protocol/computed'

import { sendPotentialResult, sendSkillPotentialResult } from './potential'
import { sendSkill } from './skill'
import { sendAscensionPerk } from './ascension_perk'

export function sendAvailableSkill(as: AvailableSkill): IAvailableSkill {
   return {
      skill: sendSkill(as.skill),
      cost: as.cost
   }
}

export function sendUnavailableSkill(us: UnavailableSkill): IUnavailableSkill {
   return {
      skill: sendSkill(us.skill),
      resultPieces: us.resultPieces.map(r => sendSkillPotentialResult(r))
   }
}

export function sendComputedSkills(cs: ComputedSkills): IComputedSkills {
   return {
      available: Object.values(cs.available).map(x => sendAvailableSkill(x)),
      unavailable: Object.values(cs.unavailable).map(x => sendUnavailableSkill(x))
   }
}

export function sendUnavailableAscensionPerks(uap: UnavailableAscensionPerk): IUnavailableAscensionPerk {
   return {
      ascensionPerk: sendAscensionPerk(uap.ascensionPerk),
      resultPieces: uap.resultPieces.map(r => sendPotentialResult(r))
   }
}

export function sendComputedAscensionPerks(ap: ComputedAscensionPerks): IComputedAscensionPerks {
   return {
      available: Object.values(ap.available).map(x => sendAscensionPerk(x)),
      unavailable: Object.values(ap.unavailable).map(x => sendUnavailableAscensionPerks(x))
   }
}

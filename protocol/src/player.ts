import { ISkill } from './skill'
import { IActivity } from './activity'
import { IAscensionPerk } from './ascension_perk'

export interface IPlayerAttributes {
   strength: number
   intelligence: number
   emotionalIntelligence: number
   memorization: number
   imagination: number
   charisma: number
}

export interface IPartialPlayerAttributes {
   strength?: number
   intelligence?: number
   emotionalIntelligence?: number
   memorization?: number
   imagination?: number
   charisma?: number
}

export interface IPlayerStatus {
   attributes?: IPlayerAttributes
   talent?: IPlayerAttributes

   energy?: number
   energyMax?: number
   skillPoints?: number
   skills?: ISkill[]
   activities?: IActivity[]
   ascensionPerks?: IAscensionPerk[]
   ascensionPerkSlots: number

   mentalHealth?: number
   mentalHealthMax?: number
   satisfactory?: number
   money?: number
   moneyPerTurn?: number
}

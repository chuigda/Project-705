import { ISkill } from './skill'
import { IPotentialResult, ISkillPotentialResult } from './potential'
import { IAscensionPerk } from './ascension_perk'

export interface IAvailableSkill {
   skill: ISkill
   cost: number
}

export interface IUnavailableSkill {
   skill: ISkill
   resultPieces: ISkillPotentialResult[]
}

export interface IComputedSkills {
   available: IAvailableSkill[]
   unavailable: IUnavailableSkill[]
}

export interface IUnavailableAscensionPerk {
   ascensionPerk: IAscensionPerk
   resultPieces: IPotentialResult[]
}

export interface IComputedAscensionPerks {
   available: IAscensionPerk[]
   unavailable: IUnavailableAscensionPerk[]
}

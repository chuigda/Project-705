export type MaybeTranslationKey = string

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

export interface ISkillCost {
   base: number
   attributes?: IPartialPlayerAttributes
}

export interface ISkillOutput {
   attributes: IPartialPlayerAttributes
}

export interface ISkill {
   ident: string
   name: MaybeTranslationKey
   description: MaybeTranslationKey

   category?: string
   cost: ISkillCost
   output?: ISkillOutput
   activities?: string[]
}

export interface IActivityOutput {
   attributes?: IPartialPlayerAttributes
   skillPoints?: number
   pressure?: number
   satisfactory?: number
   money?: number
}

export interface IActivity {
   ident: string
   name: MaybeTranslationKey
   description: MaybeTranslationKey

   category: string
   level: number
   output?: IActivityOutput
}

export interface IAscensionPerk {
   ident: string
   name: MaybeTranslationKey
   description: MaybeTranslationKey
}

export interface IPlayerStatus {
   attributes?: IPlayerAttributes
   talent?: IPlayerAttributes

   skillPoints?: number
   skills?: Record<string, ISkill>
   activities?: Record<string, IActivity>
   ascensionPerks?: Record<string, IAscensionPerk>

   pressure?: number
   satisfactory?: number
   money?: number
   moneyPerTurn?: number
}

export interface IButton {
   ident: string

   text: MaybeTranslationKey
   tooltip: MaybeTranslationKey
}

export interface ISimpleDialog {
   uid: string

   title: MaybeTranslationKey
   text: MaybeTranslationKey
   closable: boolean
   options: IButton[]
}

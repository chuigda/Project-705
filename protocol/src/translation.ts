export type ITranslationKey = string

export interface IComposedTranslatable {
   template: ITranslationKey,
   args: Record<string, ITranslatable>
}

export type ITranslatable = ITranslationKey | IComposedTranslatable

export type ITranslation = Record<string, string>

export type MaybeTranslationKey = string

export interface Button {
   ident: string

   text: MaybeTranslationKey
   tooltip: MaybeTranslationKey
}

export interface SimpleDialog {
   uid: string

   title: MaybeTranslationKey
   text: MaybeTranslationKey
   closable: boolean
   options: Button[]
}

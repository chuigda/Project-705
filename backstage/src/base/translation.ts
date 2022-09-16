import { MaybeTranslationKey } from '@app/base/uid'

export interface ComposedTranslation {
   template: MaybeTranslationKey,
   args: Record<string, MaybeTranslatable>
}

export type MaybeTranslatable = ComposedTranslation | MaybeTranslationKey

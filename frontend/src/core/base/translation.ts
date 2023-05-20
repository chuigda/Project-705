import { MaybeTranslationKey } from '@app/core/base/uid'

export interface ComposedTranslation {
   template: MaybeTranslationKey,
   args: Record<string, MaybeTranslatable>
}

export type MaybeTranslatable = ComposedTranslation | MaybeTranslationKey

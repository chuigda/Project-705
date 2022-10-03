import { MaybeTranslationKey } from '@app/base/uid'
import { ITranslatable, ITranslationKey } from '@protocol/translation'
import { MaybeTranslatable } from '@app/base/translation'

export function sendTranslationKey(k: MaybeTranslationKey): ITranslationKey {
   return <ITranslationKey>k
}

export function sendTranslatable(t: MaybeTranslatable): ITranslatable {
   return <ITranslatable>t
}

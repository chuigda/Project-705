import messages from '@app/i18n/messages'

export default function makeI18nOption(preferredLang: string) {
   return {
      locale: preferredLang,
      fallbackLocale: 'zh_cn',

      messages
   }
}

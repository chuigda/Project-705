import { PassiveRelicItem } from '@app/ruleset'

const passiveRelicItems: PassiveRelicItem[] = [
   {
      ident: 'flaribbit_anki_book',
      name: '$si_flaribbit_anki_book',
      description: '$si_flaribbit_anki_book_desc',

      kind: 'passive_relic',
      level: 'myth',
      onAddedEvents: ['flaribbit_anki_book_added']
   }
]

export default passiveRelicItems

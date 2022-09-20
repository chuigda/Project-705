import { PassiveRelicItem } from '@app/ruleset'

const passiveRelicItems: PassiveRelicItem[] = [
   {
      ident: 'chuigda_bp_database',
      name: '$si_chuigda_bp_database',
      description: '$si_chuigda_bp_database_desc',

      kind: 'passive_relic',
      level: 'myth',
      onAddedEvents: ['chuigda_bp_database']
   },
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

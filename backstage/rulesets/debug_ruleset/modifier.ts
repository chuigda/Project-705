import { Modifier } from '@app/ruleset'

const modifiers: Modifier[] = [
   {
      ident: 'test_property_modifier',
      name: '$md_test_property',
      description: '$md_test_property_desc',
      playerProperty: {
         'property': {
            'all': { gain: 0.2, loss: 0.2 }
         }
      }
   },
   {
      ident: 'test_property_modifier1',
      name: '$md_test_property1',
      description: '$md_test_property_desc1',
      playerProperty: {
         'property': {
            '@test': { gain: 0.1, loss: -0.1 }
         }
      }
   },
   {
      ident: 'test_property_modifier2',
      name: '$md_test_property2',
      description: '$md_test_property_desc2',
      playerProperty: {
         'property': {
            '@test': { gain: 0.1, loss: -0.2 }
         }
      }
   },
   {
      ident: 'test_property_modifier3',
      name: '$md_test_property3',
      description: '$md_test_property_desc3',
      playerProperty: {
         'property': {
            '@test2': { loss: 0.1 }
         }
      }
   }
]

export default modifiers

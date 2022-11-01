import { Event } from '@app/ruleset'

const events: Event[] = [
   {
      ident: 'property_update_detect',
      event: (cx, opRef, source) => (cx.getV('update_detected_fn'))(opRef, source)
   },
   {
      ident: 'property_overflow_detect',
      event: cx => (cx.getV('overflow_detected_fn'))()
   },
   {
      ident: 'property_underflow_detect',
      event: cx => (cx.getV('underflow_detected_fn'))()
   }
]

export default events

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
   },
   {
      ident: 'create_bm',
      event: cx => {
         cx.createBubbleMessage({
            icon: 'normal',
            dialogTemplate: {
               title: '不艰难的抉择',
               text: '抉择通常来说都是很艰难的，但这是一个不艰难的抉择，你只要点第一个选项就可以了。',
               options: [
                  {
                     optionKey: 'key1',
                     text: '安全选项',
                     tooltip: '这是一个安全的选项，点我就对了',
                     textResponse: '然后什么都没有发生',
                     onClickEvents: []
                  },
                  {
                     optionKey: 'key2',
                     text: '危险选项',
                     tooltip: '这是一个不安全的选项，别点我就对了',
                     danger: true,
                     textResponse: '逗你玩的，其实什么都不会发生',
                     onClickEvents: []
                  }
               ]
            },
            kind: 'user_dialog',
            tooltip: '不艰难的抉择'
         })
      }
   }
]

export default events

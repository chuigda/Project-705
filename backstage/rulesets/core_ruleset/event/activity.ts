import { Event } from '@app/ruleset'

const activityEvents: Event[] = [
    {
        ident: 'novel_writing_progress',
        event: cx => {
            cx.updateV('novel_progress', progress => progress + Math.random())
            const currValue = cx.getV('novel_progress') || 0.0
            if (currValue >= 10.0) {
                cx.triggerEvent('novel_finished')
            }
        }
    },
    {
        ident: 'novel_finished',
        event: cx => {
            cx.setV('novel_progress', 0.0)
            cx.updateProperty('finished_novel_count', 'add', 1)

            // TODO(chuigda): 弹出一个气泡消息
        }
    }
]

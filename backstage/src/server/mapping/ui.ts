import { BubbleMessage, DialogBubbleMessage, PromptBubbleMessage, SimpleDialog } from '@app/executor/ui'
import { IBubbleMessage, IDialogBubbleMessage, IDialogOption, IPromptBubbleMessage, ISimpleDialog } from '@protocol/ui'
import { sendTranslatable } from '@app/server/mapping/translation'
import { unreachable } from '@app/util/emergency'

export function sendSimpleDialog(dialog: SimpleDialog): ISimpleDialog {
   return {
      ...dialog,
      title: sendTranslatable(dialog.title),
      text: sendTranslatable(dialog.text),
      options: <IDialogOption[]>(<unknown>{ ...dialog.options, onClickEvents: undefined })
   }
}

export function sendPromptBubbleMessage(message: PromptBubbleMessage): IPromptBubbleMessage {
   return {
      ...message,
      tooltip: sendTranslatable(message.tooltip)
   }
}

export function sendDialogBubbleMessage(message: DialogBubbleMessage): IDialogBubbleMessage {
   return {
      ...message,
      tooltip: sendTranslatable(message.tooltip),
      dialog: sendSimpleDialog(message.dialog)
   }
}

export function sendBubbleMessage(message: BubbleMessage): IBubbleMessage {
   switch (message.kind) {
      case 'prompt': return sendPromptBubbleMessage(message)
      case 'user_dialog': return sendDialogBubbleMessage(message)
   }

   return unreachable()
}

import {
   BubbleMessageTemplate,
   DialogBubbleMessageTemplate,
   PromptBubbleMessageTemplate,
   SimpleDialogTemplate
} from '@app/core/ruleset/items/ui'
import { GameContext } from '@app/core/game_context'
import { ensureScope } from '@app/core/game_context/scope'
import { compileTranslatable } from '@app/core/loader/compile'
import { triggerEventSeries } from '@app/core/events'

export interface SimpleDialog extends SimpleDialogTemplate {
   readonly uid: string
}

export interface BubbleMessageBase {
   readonly uid: string
}

export interface PromptBubbleMessage extends PromptBubbleMessageTemplate, BubbleMessageBase {}

export interface DialogBubbleMessage extends DialogBubbleMessageTemplate, BubbleMessageBase {
   readonly dialog: string
}

export type BubbleMessage = PromptBubbleMessage | DialogBubbleMessage

function nextItemID(gameContext: GameContext, ty: string): string {
   const uid = gameContext.uiItemCounter
   gameContext.uiItemCounter += 1
   return `${ty}-${uid}`
}

export function createPromptBubbleMessage(
   gameContext: GameContext,
   template: PromptBubbleMessageTemplate
): PromptBubbleMessage {
   const bubbleMessage = {
      ...template,
      uid: nextItemID(gameContext, 'bm'),
      tooltip: compileTranslatable(ensureScope(gameContext), template.tooltip)
   }

   gameContext.state.bubbleMessages.push(bubbleMessage)
   return bubbleMessage
}

export function createDialog(gameContext: GameContext, template: SimpleDialogTemplate): SimpleDialog {
   const scope = ensureScope(gameContext)
   const uid = nextItemID(gameContext, 'dlg')
   const dialog = {
      ...template,
      uid,
      title: compileTranslatable(scope, template.title),
      text: compileTranslatable(scope, template.text),
      options: template.options.map(option => ({
         ...option,
         text: compileTranslatable(scope, option.text),
         tooltip: compileTranslatable(scope, option.text)
      }))
   }

   gameContext.state.dialogs[uid] = dialog
   return dialog
}

export function useDialogOption(gameContext: GameContext, dialogId: string, optionKey: string): void {
   const dialog = gameContext.state.dialogs[dialogId]
   if (!dialog) {
      throw new Error(`[E] [useDialogOption] dialog '${dialogId}' does not exist`)
   }

   const option = dialog.options.find(opt => opt.optionKey === optionKey)
   if (!option) {
      throw new Error(`[E] [useDialogOption] dialog '${dialogId}' does not have option '${optionKey}'`)
   }

   return triggerEventSeries(gameContext, option.onClickEvents)
}

export function destroyDialog(gameContext: GameContext, uid: string): void {
   if (!gameContext.state.dialogs[uid]) {
      throw new Error(`[E] [destroyDialog] dialog '${uid}' does not exist`)
   }

   delete gameContext.state.dialogs[uid]
}

export function createDialogBubbleMessage(
   gameContext: GameContext,
   template: DialogBubbleMessageTemplate
): DialogBubbleMessage {
   const dialog: SimpleDialog = createDialog(gameContext, template.dialogTemplate)

   const bubbleMessage = {
      ...template,
      uid: nextItemID(gameContext, 'bm'),
      tooltip: compileTranslatable(ensureScope(gameContext), template.tooltip),
      dialog: dialog.uid
   }

   gameContext.state.bubbleMessages.push(bubbleMessage)
   return bubbleMessage
}

export function createBubbleMessage(
   gameContext: GameContext,
   template: BubbleMessageTemplate
): BubbleMessage {
   switch (template.kind) {
      case 'prompt': return createPromptBubbleMessage(gameContext, template)
      case 'user_dialog': return createDialogBubbleMessage(gameContext, template)
   }
}

export function closeBubbleMessage(gameContext: GameContext, uid: string): void {
   const toBeClosed = gameContext.state.bubbleMessages.find(bm => bm.uid === uid)
   if (!toBeClosed) {
      throw new Error(`[E] [closeBubbleMessage] bubble message '${uid}' does not exist`)
   }

   if (toBeClosed.kind === 'user_dialog') {
      destroyDialog(gameContext, toBeClosed.dialog)
   }

   gameContext.state.bubbleMessages = gameContext.state.bubbleMessages.filter(bm => bm.uid !== uid)
}

const uiFunctions = {
   createDialog,
   destroyDialog,
   createBubbleMessage,
   closeBubbleMessage
}

export default uiFunctions

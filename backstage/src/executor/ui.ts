import {
   BubbleMessageTemplate,
   DialogBubbleMessageTemplate,
   PromptBubbleMessageTemplate,
   SimpleDialogTemplate
} from '@app/ruleset/items/ui'
import { GameContext } from '@app/executor/game_context'
import { ensureScope } from '@app/executor/game_context/scope'
import { unreachable } from '@app/util/emergency'
import { compileTranslatable } from '@app/loader/compile'
import { QResult } from '@app/executor/result'
import { triggerEventSeries } from '@app/executor/events'

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
   gameContext.updateTracker.bubbleMessages = true
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

export function useDialogOption(gameContext: GameContext, dialogId: string, optionKey: string): QResult {
   const dialog = gameContext.state.dialogs[dialogId]
   if (!dialog) {
      const errMessage = `dialog '${dialogId}' does not exist`
      console.error(`[E] [useDialogOption] ${errMessage}`)
      return [false, errMessage]
   }

   const option = dialog.options.find(opt => opt.optionKey === optionKey)
   if (!option) {
      const errMessage = `dialog '${dialogId}' does not have option '${optionKey}'`
      console.error(`[E] [useDialogOption] ${errMessage}`)
      return [false, errMessage]
   }

   return triggerEventSeries(gameContext, option.onClickEvents)
}

export function destroyDialog(gameContext: GameContext, uid: string): QResult {
   if (!gameContext.state.dialogs[uid]) {
      const errMessage = `dialog '${uid}' does not exist`
      console.error(`[E] [destroyDialog] ${errMessage}`)
      return [false, errMessage]
   }
   delete gameContext.state.dialogs[uid]
   return [true]
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
   gameContext.updateTracker.bubbleMessages = true
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

   return unreachable()
}

export function closeBubbleMessage(gameContext: GameContext, uid: string): QResult {
   const toBeClosed = gameContext.state.bubbleMessages.find(bm => bm.uid === uid)
   if (!toBeClosed) {
      const errMessage = `bubble message '${uid}' does not exist`
      console.error(`[E] [closeBubbleMessage] ${errMessage}`)
      return [false, errMessage]
   }

   if (toBeClosed.kind === 'user_dialog') {
      const [success, message] = destroyDialog(gameContext, toBeClosed.dialog)
      if (!success) {
         console.warn(`[W] [closeBubbleMessage] error closing linked dialog: ${message}`)
      }
   }

   gameContext.state.bubbleMessages = gameContext.state.bubbleMessages.filter(bm => bm.uid !== uid)
   gameContext.updateTracker.bubbleMessages = true
   return [true]
}

const uiFunctions = {
   createDialog,
   destroyDialog,
   createBubbleMessage,
   closeBubbleMessage
}

export default uiFunctions

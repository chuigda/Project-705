import { Ident, mDisplayItemId } from '@app/base/uid'
import { BubbleMessageIcon, BubbleMessageTemplate, SimpleDialogTemplate } from '@app/ruleset/items/ui'
import { GameContext } from '@app/executor/game_context'
import { MaybeTranslatable } from '@app/base/translation'
import { ensureScope } from '@app/executor/game_context/scope'

export interface SimpleDialog extends SimpleDialogTemplate {
   readonly uid: string

   display: boolean
}

export interface BubbleMessage {
   readonly ident: Ident
   readonly uid: string

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslatable
   readonly linkedDialog: string
}

function nextItemID(gameContext: GameContext): number {
   const uid = gameContext.uiItemCounter
   gameContext.uiItemCounter += 1
   return uid
}

export function createDialog(gameContext: GameContext, template: Ident | SimpleDialogTemplate): SimpleDialog | null {
   let inlineTemplate: SimpleDialogTemplate
   if (typeof template === 'object' && 'ident' in template) {
      inlineTemplate = template
   } else {
      const templateId = mDisplayItemId(ensureScope(gameContext), template)
      inlineTemplate = gameContext.ruleSet.ui.dialogTemplates[templateId]
      if (!inlineTemplate) {
         console.error(`[E] [createDialog] bad dialog template '${template}'`)
         return null
      }
   }

   const uid = nextItemID(gameContext)
   const dialog: SimpleDialog = {
      uid: `dlg-${uid}`,
      display: true,

      ...inlineTemplate
   }
   gameContext.state.dialogs.push(dialog)
   gameContext.updateTracker.dialogs = true

   return dialog
}

export function createBubbleMessage(
   gameContext: GameContext,
   template: Ident | BubbleMessageTemplate
): BubbleMessage | null {
   let inlineTemplate: BubbleMessageTemplate
   if (/* BubbleMessageTemplate */ typeof template === 'object' && 'ident' in template) {
      inlineTemplate = template
   } /* Ident */ else {
      const templateId = mDisplayItemId(ensureScope(gameContext), template)
      inlineTemplate = gameContext.ruleSet.ui.bubbleMessageTemplates[templateId]
      if (!inlineTemplate) {
         console.error(`[E] [createBubbleMessage] bad bubble message template '${template}'`)
         return null
      }
   }

   let dialog: SimpleDialog | null
   if (
   /* SimpleDialogTemplate */ typeof inlineTemplate.linkedDialog === 'object' &&
    'ident' in inlineTemplate.linkedDialog
   ) {
      dialog = createDialog(gameContext, inlineTemplate.linkedDialog)
   } /* Ident */ else {
      const linkedDialogId: string = mDisplayItemId(ensureScope(gameContext), inlineTemplate.linkedDialog)
      dialog = createDialog(gameContext, linkedDialogId)
   }
   if (!dialog) {
      console.error('[E] [createBubbleMessage] error creating linked dialog')
      return null
   }

   dialog.display = false

   const uid = nextItemID(gameContext)
   const bubbleMessage: BubbleMessage = {
      uid: `bub-${uid}`,
      ...inlineTemplate,
      linkedDialog: dialog.uid
   }
   gameContext.state.bubbleMessages.push(bubbleMessage)
   gameContext.updateTracker.bubbleMessages = true
   return bubbleMessage
}

const uiFunctions = {
   createDialog,
   createBubbleMessage
}

export default uiFunctions

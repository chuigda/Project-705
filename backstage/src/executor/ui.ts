import { Ident, MaybeTranslationKey, mDisplayItemId } from '@app/base/uid'
import { BubbleMessageIcon, BubbleMessageTemplate, SimpleDialogTemplate } from '@app/ruleset/items/ui'
import { GameContext } from '@app/executor/game_context'

export class SimpleDialog extends SimpleDialogTemplate {
   readonly uid: string

   display: boolean
}

export class BubbleMessage {
   readonly ident: Ident
   readonly uid: string

   readonly icon: BubbleMessageIcon
   readonly tooltip: MaybeTranslationKey
   readonly linkedDialog: string
}

function nextItemID(gameContext: GameContext): number {
   const uid = gameContext.uiItemCounter
   gameContext.uiItemCounter += 1
   return uid
}

export function createDialog(gameContext: GameContext, template: Ident | SimpleDialogTemplate): SimpleDialog | null {
   let inlineTemplate: SimpleDialogTemplate
   if (template instanceof SimpleDialogTemplate) {
      inlineTemplate = template
   } else {
      const templateId = mDisplayItemId(gameContext.scope!, template)
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
   if (template instanceof BubbleMessageTemplate) {
      inlineTemplate = template
   } else {
      const templateId = mDisplayItemId(gameContext.scope!, template)
      inlineTemplate = gameContext.ruleSet.ui.bubbleMessageTemplates[templateId]
      if (!inlineTemplate) {
         console.error(`[E] [createBubbleMessage] bad bubble message template '${template}'`)
         return null
      }
   }

   let dialog: SimpleDialog | null
   if (inlineTemplate.linkedDialog instanceof SimpleDialogTemplate) {
      dialog = createDialog(gameContext, inlineTemplate.linkedDialog)
   } else {
      const linkedDialogId: string = mDisplayItemId(gameContext.scope!, inlineTemplate.linkedDialog)
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

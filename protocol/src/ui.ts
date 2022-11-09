import { ITranslatable } from './translation'

export interface IDialogOption {
   optionKey: string
   text: ITranslatable
   tooltip: ITranslatable
   danger: boolean
}

export interface ISimpleDialog {
   uid: string,
   title: ITranslatable
   // TODO(chuigda, flaribbit): properly handle this when we have gfx features
   picture?: string
   text: ITranslatable
   options: IDialogOption[]
}

// TODO(chuigda, flaribbit): properly handle this when we have gfx features
export const builtinBubbleMessageIconList = ['normal', 'important'] as const
export type IBubbleMessageIcon = typeof builtinBubbleMessageIconList[number] | string

// TODO(chuigda, lyra): add IM chat when we finish diplomacy system
// TODO(chuigda): add scenario when we finish scenario system
export const bubbleMessageKindList = ['prompt', 'user_dialog'] as const
export type IBubbleMessageKind = typeof bubbleMessageKindList[number]

export interface IBubbleMessageBase<MessageKindString extends IBubbleMessageKind> {
   kind: IBubbleMessageKind
   uid: string
   icon: IBubbleMessageIcon
   tooltip: ITranslatable
}

export type IPromptBubbleMessage = IBubbleMessageBase<'prompt'>

export interface IDialogBubbleMessage extends IBubbleMessageBase<'user_dialog'> {
   dialog: string
}

export type IBubbleMessage = IPromptBubbleMessage | IDialogBubbleMessage

import { ITranslatable } from './translation'

export interface IButton {
   ident: string

   text: ITranslatable
   tooltip: ITranslatable
}

export interface IDialogOption {
   optionKey: string

   text: ITranslatable
   tooltip: ITranslatable
   danger: boolean
}

export interface ISimpleDialog {
   uid: string

   title: ITranslatable
   text: ITranslatable
   options: IDialogOption[]
   display: boolean
}

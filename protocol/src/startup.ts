import {ITranslationKey} from "./translation";
import {IStartupPlayerProperties} from "./index";

export interface IStartup {
   ident: string,
   name: ITranslationKey,
   description: ITranslationKey,

   player?: IStartupPlayerProperties
   modifier?: object
}

export type QResult = [boolean] | [boolean, string | undefined]

export function concatMessage(message0?: string, message1?: string): string | undefined {
   if (!message1) {
      return message0
   }

   if (!message0) {
      return message1
   }

   return `${message0}\n${message1}`
}

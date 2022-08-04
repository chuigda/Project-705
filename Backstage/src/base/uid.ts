export function uniqueId(author: string, moduleName: string, category: string, id: string): string {
   return `@${author}:${moduleName}:${category}:${id}`
}

export class Scope {
   constructor(author: string, moduleName: string) {
      this.author = author
      this.moduleName = moduleName
   }

   readonly author: string
   readonly moduleName: string
}

export class ComposedId {
   constructor(author: string, moduleName: string, id: string) {
      this.author = author
      this.moduleName = moduleName
      this.id = id
   }

   readonly author: string
   readonly moduleName: string
   readonly id: string
}

export type Ident = string | ComposedId

export type IdResolver = (scope: Scope, id: Ident) => string

export function buildIdResolver(idKind: string): IdResolver {
   return (scope: Scope, id: string | ComposedId): string => {
      if (id instanceof ComposedId) {
         const { author, moduleName, id: id1 } = id
         return uniqueId(author, moduleName, idKind, id1)
      }

      if (id.startsWith('@')) {
         return id
      } else {
         const { author, moduleName } = scope
         return uniqueId(author, moduleName, idKind, id)
      }
   }
}

export const ascensionPerkId = buildIdResolver('ap')
export const skillId = buildIdResolver('sk')
export const startupId = buildIdResolver('st')
export const activityId = buildIdResolver('ac')
export const eventId = buildIdResolver('ev')
export const modifierId = buildIdResolver('md')
export const translationKey = buildIdResolver('tr')

export function isTranslationKey(key: string): boolean {
   return key.startsWith('$')
}

export function isAbsoluteTranslationKey(key: string): boolean {
   return key.startsWith('$') && key.indexOf('$') !== -1
}

export type MaybeTranslationKey = string

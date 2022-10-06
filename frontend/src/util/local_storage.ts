export function setLocalStorage(key: string, value?: string) {
   if (!value) {
      localStorage.removeItem(key)
   } else {
      localStorage.setItem(key, value)
   }
}

export function getLocalStorage(key: string): string | null {
   return localStorage.getItem(key)
}

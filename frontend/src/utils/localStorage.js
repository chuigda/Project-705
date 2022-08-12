export const getLocalStorage = name => window.localStorage.getItem(name)

export const setLocalStorage = (name, content) => window.localStorage.setItem(name, content)

export const purgeLocalStorage = name => window.localStorage.removeItem(name)

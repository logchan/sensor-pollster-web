export function globalData<T>(type: (new () => T), key: string | null = null): T {
  const actualKey = key || type.name
  //@ts-ignore
  const state = global[actualKey] || new type()
  //@ts-ignore
  global[actualKey] = state
  return state
}

export function getLocalStorage<T>(type: (new () => T), key: string | null = null): T {
  const actualKey = key || type.name
  const json = localStorage.getItem(actualKey)
  const obj = new type()
  if (json) {
    Object.assign(obj, JSON.parse(json))
  }
  return obj
}

export function setLocalStorage<T>(type: (new () => T), obj: T, key: string | null = null) {
  const actualKey = key || type.name
  localStorage.setItem(actualKey, JSON.stringify(obj))
}
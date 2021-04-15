import { useState } from 'react'

export function useGlobalState<T>(type: (new () => T), stateKey: string | null = null): [T, () => void] {
  const key = stateKey || type.name
  //@ts-ignore
  const [state, setState] = useState<T>(global[key] || new type())
  const updateState = () => {
    const clone = Object.assign({}, state)
    //@ts-ignore
    global[key] = clone
    setState(clone)
  }
  return [state, updateState]
}

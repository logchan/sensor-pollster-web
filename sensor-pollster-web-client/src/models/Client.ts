import Sensor from "./Sensor"

export default class Client {
  private createApiRequest<T>(method: string, url: string, payload: any = null) {
    return new Promise((resolve: (value: T) => void, reject) => {
      const req = new XMLHttpRequest()
      req.open(method, url)
      req.responseType = 'json'
      req.addEventListener('load', () => {
        if (req.status === 200) {
          resolve(req.response as T)
        }
        else {
          reject(req.statusText)
        }
      })
      req.addEventListener('error', ev => reject(ev))
      req.addEventListener('abort', ev => reject(ev))

      if (payload === null) {
        req.send()
      }
      else {
        req.setRequestHeader('Content-Type', 'application/json')
        req.send(JSON.stringify(payload))
      }
    })
  }

  async getData(address: String|null, start: String|null, until: String|null, limit: number) {
    const app = (name: String, val: String|null) => val == null ? "" : `${name}=${val}`
    const url = '/api/data/get?' + 
      app("address", address) + 
      app("start", start) + 
      app("until", until) + 
      app("limit", limit.toString())
    return await this.createApiRequest<Sensor[]>('GET', url)
  }
  async getAllSensorData(limit: number) {
    return await this.getData(null, null, null, limit)
  }
}
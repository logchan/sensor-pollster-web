export class FloorPlanSensorInfo {
  x = 0.0
  y = 0.0
  color = ""
}

export class FloorPlanConfig {
  size = 8
  fontSize = 16
  fontWeight = "normal"
  backgroundOpacity = 0.4
}

export class FloorPlanData {
  sensors = new Map<String, FloorPlanSensorInfo>()
  config = new FloorPlanConfig()

  static postProcess(data: FloorPlanData) {
    const pos = data.sensors as any
    data.sensors = new Map<String, FloorPlanSensorInfo>()
    for (let k in pos) {
      data.sensors.set(k, pos[k])
    }

    const cfg = new FloorPlanConfig()
    Object.assign(cfg, data.config)
    data.config = cfg
    return data
  }
}

import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Client from '../models/Client'
import { FloorPlanSensorInfo, FloorPlanConfig, FloorPlanData } from '../models/FloorPlanData'
import { FloorPlanStatus } from '../models/FloorPlanStatus'
import Sensor from '../models/Sensor'

class FloorPlanViewProps {
  sensors: Sensor[] = []
  updateStatus = (state: FloorPlanStatus) => {}
}

class FloorPlanViewState {
  status = FloorPlanStatus.Loading
  data = new FloorPlanData()
  imgWidth = 100
  imgHeight = 100
  divWidth = 100
  svgWidth = 100
  svgHeight = 100
}

class SingleSensorProps {
  posFactor = 1
  sensor = new Sensor()
  info = new FloorPlanSensorInfo()
  cfg = new FloorPlanConfig()
}

function SingleSensor(props: SingleSensorProps) {
  const info = props.info
  const sensor = props.sensor
  const cfg = props.cfg
  const data = sensor.data[0]
  const [hover, setHover] = useState(false)

  const size = hover ? cfg.size * 1.1 : cfg.size
  return <g transform={`translate(${info.x * props.posFactor} ${info.y * props.posFactor})`}>
        <ellipse fill={info.color} cx={0} cy={0} rx={size} ry={size}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        />
        <text x={0} y={-cfg.size-cfg.fontSize/2} textAnchor="middle" fontSize={cfg.fontSize} fontWeight={cfg.fontWeight}>{data.temperature}</text>
        { hover ? <g transform={`translate(0 ${size+cfg.fontSize})`}>
            <text x={0} fontSize={cfg.fontSize} textAnchor="middle">{sensor.name}</text>
            <text x={0} dy={cfg.fontSize} fontSize={cfg.fontSize} textAnchor="middle">Battery: {data.battery}</text>
            <text x={0} dy={cfg.fontSize*2} fontSize={cfg.fontSize} textAnchor="middle">RSSI: {data.rssi}</text>
          </g>: null }
    </g>
}

export default function FloorPlanView(props: FloorPlanViewProps) {
  const imgUrl = "/api/floor-plan/image"
  const [state, setState] = useState(new FloorPlanViewState())
  const updateState = () => setState({...state})

  const updateSize = () => {
    state.divWidth = document.getElementById("floor-plan-div")!.clientWidth
    const factor = Math.min(state.divWidth / state.imgWidth, 10)
    state.svgWidth = state.imgWidth * factor
    state.svgHeight = state.imgHeight * factor
  }

  useEffect(() => {
    const handler = () => {
      updateSize()
      updateState()
    }
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("resize", handler)
    }
  })

  const imageLoaded = async (img: HTMLImageElement) => {
    state.imgWidth = img.naturalWidth
    state.imgHeight = img.naturalHeight
    updateSize()

    try {
      state.data = await (new Client()).getFloorPlanData()
      if (state.data === null) {
        throw "JSON parsing failure"
      }
      state.data = FloorPlanData.postProcess(state.data)
      state.status = FloorPlanStatus.Loaded
    }
    catch (ex) {
      console.error(ex)
      state.status = FloorPlanStatus.Failed
    }
    props.updateStatus(state.status)
    updateState()
  }

  return <div id="floor-plan-div">
    <img style={{display: "none"}} src={imgUrl} onLoad={ev => imageLoaded(ev.target as HTMLImageElement)} />
    { state.status === FloorPlanStatus.Loaded ?
    <svg width="100%" height={state.svgHeight + state.data.config.fontSize * 3}>
      <image href={imgUrl} width="100%" style={{opacity: state.data.config.backgroundOpacity}} />
      { props.sensors.map(sensor => {
        const cfg = state.data.config
        const info = state.data.sensors.get(sensor.address)
        if (!info) {
          return null
        }

        const factor = state.divWidth / state.imgWidth
        return <SingleSensor key={sensor.address} posFactor={factor} info={info} cfg={cfg} sensor={sensor} />
      })}
    </svg> : null }
    { state.status === FloorPlanStatus.Failed ?
    <Typography variant="body1">Failed to load floor plan</Typography> : null }
  </div>
}
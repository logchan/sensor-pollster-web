import { Button, Checkbox, debounce, FormControlLabel, Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Client from '../models/Client'
import Sensor from '../models/Sensor'
import { vlarge, vsmall } from '../utils/JsxUtils'
import { useQuery } from '../utils/Routing'
import DataEntry from '../models/DataEntry'
import SensorGraph from '../components/SensorGraph'
import { FloorPlanData, FloorPlanSensorInfo } from '../models/FloorPlanData'

class GraphsState {
  loaded = false
  data: Sensor[] = []
  floorPlan = new FloorPlanData()
  start = new Date(new Date().getTime() - 24*60*60*1000)
  end = new Date()
  divWidth = 1000
  showSensor = new Map<String, Boolean>()
}

export default function Graphs() {
  const query = useQuery()
  const addresses = query.get("address")?.split(",") ?? null
  const [state, setState] = useState(new GraphsState())
  const updateState = () => setState({...state})
  const updateSize = () => {
    state.divWidth = window.innerWidth - 300
  }

  useEffect(() => {
    const update = debounce(() => {
      updateSize()
      updateState()
    }, 100)
    const handler = () => update()
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("resize", handler)
    }
  })

  useEffect(() => {
    if (state.loaded) {
      return
    }
    (async () => {
      const client = new Client()
      state.data = await client.getAllSensorData(0)
      try {
        state.floorPlan = FloorPlanData.postProcess(await client.getFloorPlanData())
      }
      catch (ex) {
        state.floorPlan.sensors = new Map<String, FloorPlanSensorInfo>()
        state.data.forEach(s => {
          const info = new FloorPlanSensorInfo()
          info.color = "black"
          state.floorPlan.sensors.set(s.address, info)
        })
      }
      state.loaded = true
      updateSize()
      updateState()
    })()
  })

  const setRange = (offset: number) => {
    state.end = new Date()
    state.start = new Date(state.end.getTime() - offset)
    updateState()
  }
  const hoursOffset = (hours: number) => {
    return hours * 60*60*1000
  }
  const makeOffsetBtn = (text: String, hours: number) => {
    return <Grid item><Button variant="outlined" onClick={() => {
      setRange(hoursOffset(hours))
    }}>{text}</Button></Grid>
  }

  return <div>
    <Typography variant="h4">Graphs</Typography>
    {vlarge()}
    <Grid container>
      <Grid item sm={12}>
      { state.loaded ?
        <SensorGraph data={state.data.filter(s => state.showSensor.get(s.address) ?? true)} info={state.floorPlan.sensors} getter={(d: DataEntry) => d.temperature} 
        start={state.start} end={state.end} width={state.divWidth}
        label="Temperature" /> :
        <Typography variant="body1">Loading</Typography> }
      </Grid>
    </Grid>
    {state.loaded ?
    <div>
      {vlarge()}
      <Grid container spacing={2}>
        { state.data.map(sensor => {
          const info = state.floorPlan.sensors.get(sensor.address)!
          return <FormControlLabel key={sensor.address}
            control={<Checkbox color="primary" defaultChecked onChange={ev => {
              const cb = ev.target as HTMLInputElement
              state.showSensor.set(sensor.address, cb.checked)
              updateState()
            }} />}
            label={sensor.name}
            style={{color: info.color}}
          />
        }) }
      </Grid>
      {vlarge()}
      <Grid container spacing={2}>
        {makeOffsetBtn("1 hour", 1)}
        {makeOffsetBtn("3 hours", 3)}
        {makeOffsetBtn("6 hours", 6)}
        {makeOffsetBtn("12 hours", 12)}
        {makeOffsetBtn("24 hours", 24)}
        {makeOffsetBtn("3 days", 24*3)}
        {makeOffsetBtn("7 days", 24*7)}
        {makeOffsetBtn("30 days", 24*30)}
      </Grid>
    </div> : null }
  </div>
}
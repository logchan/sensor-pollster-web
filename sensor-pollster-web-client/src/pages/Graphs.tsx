import { Grid, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Client from '../models/Client'
import Sensor from '../models/Sensor'
import { vlarge } from '../utils/JsxUtils'
import { useQuery } from '../utils/Routing'
import DataEntry from '../models/DataEntry'
import SensorGraph from '../components/SensorGraph'
import { FloorPlanData } from '../models/FloorPlanData'
import { Satellite } from '@material-ui/icons'

class GraphsState {
  loaded = false
  data: Sensor[] = []
  floorPlan = new FloorPlanData()
  start = new Date(new Date().getTime() - 24*60*60*1000)
  end = new Date()
}

export default function Graphs() {
  const query = useQuery()
  const addresses = query.get("address")?.split(",") ?? null
  const [state, setState] = useState(new GraphsState())
  const updateState = () => setState({...state})

  useEffect(() => {
    if (state.loaded) {
      return
    }
    (async () => {
      const client = new Client()
      state.data = await client.getAllSensorData(0)
      try {
        state.floorPlan = await client.getFloorPlanData()
      }
      catch {
        // ignore
      }
      state.loaded = true
      updateState()
    })()
  })

  if (!state.loaded) {
    return <div>
    <Typography variant="h4">Graphs</Typography>
    {vlarge()}
    <Typography variant="body1">Loading</Typography>
  </div>
  }

  return <div>
    <Typography variant="h4">Graphs</Typography>
    {vlarge()}
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <SensorGraph data={state.data} info={state.floorPlan.sensors} getter={(d: DataEntry) => d.temperature} 
        start={state.start} end={state.end}
        label="Temperature" />
      </Grid>
    </Grid>
  </div>
}
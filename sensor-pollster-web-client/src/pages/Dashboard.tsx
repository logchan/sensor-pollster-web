import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import FloorPlanView from '../components/FloorPlanView'
import Client from '../models/Client'
import { FloorPlanStatus } from '../models/FloorPlanStatus'
import Sensor from '../models/Sensor'
import { vlarge, vsmall } from '../utils/JsxUtils'

class DashboardState {
  fetchedData = false
  data: Sensor[] = []
  floorPlanStatus = FloorPlanStatus.Loading
}

export default function Dashboard() {
  const client = new Client()
  const [state, setState] = useState(new DashboardState())
  const updateState = () => setState({...state})
  const fetchData = async () => {
    try {
      state.data = await client.getAllSensorData(1)
      return true
    }
    catch (ex) {
      console.error(ex)
      return false
    }
  }
  
  useEffect(() => {
    if (state.fetchedData) {
      return
    }
    (async () => {
      if (await fetchData()) {
        state.fetchedData = true
        updateState()
      }
    })()
  })

  return <div>
    <Typography variant="h3">Dashboard</Typography>
    {vsmall()}
    <Grid container>
      <Grid item sm={12}>
        <TableContainer component={Paper} 
          style={{maxHeight: state.floorPlanStatus === FloorPlanStatus.Loaded ? "300px" : "none" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sensor</TableCell>
                <TableCell align="right">Temperature</TableCell>
                <TableCell align="right" style={{width: 100}}>Battery</TableCell>
                <TableCell align="right" style={{width: 100}}>RSSI</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>MAC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { state.data.map(sensor => {
                let data = sensor.data[0]
                return <TableRow key={sensor.address}>
                  <TableCell>{sensor.name}</TableCell>
                  <TableCell align="right">{data.temperature}</TableCell>
                  <TableCell align="right">{data.battery}</TableCell>
                  <TableCell align="right">{data.rssi}</TableCell>
                  <TableCell>{data.time}</TableCell>
                  <TableCell>{sensor.address}</TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
    { vlarge() }
    <Grid container>
      <Grid item sm={12}>
        <FloorPlanView sensors={state.data} updateStatus={s => {
          state.floorPlanStatus = s
          updateState()
        }} />
      </Grid>
    </Grid>
  </div>
}